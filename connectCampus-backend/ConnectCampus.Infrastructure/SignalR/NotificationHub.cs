using Microsoft.AspNetCore.SignalR;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Features.Chat.SendMessage;
using MediatR;
using System.Collections.Concurrent;
using ConnectCampus.Application.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ConnectCampus.Infrastructure.SignalR;

public class ChatHub : Hub<IChatHub>
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDbContext _dbContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IChatGroupRepository _chatGroupRepository;
    private readonly IServiceProvider _serviceProvider;
    
    // Static dictionary to track online users
    private static readonly ConcurrentDictionary<string, HashSet<string>> _onlineUsers = new();
    private static readonly ConcurrentDictionary<string, string> _connectionToUser = new();

    public ChatHub(IMediator mediator, ICurrentUserService currentUserService, IDbContext dbContext, IUnitOfWork unitOfWork, IChatGroupRepository chatGroupRepository, IServiceProvider serviceProvider)
    {
        _mediator = mediator;
        _currentUserService = currentUserService;
        _dbContext = dbContext;
        _unitOfWork = unitOfWork;
        _chatGroupRepository = chatGroupRepository;
        _serviceProvider = serviceProvider;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = _currentUserService.UserId?.ToString();
        
        if (!string.IsNullOrEmpty(userId))
        {
            // Add to user group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            
            // Track online status
            _connectionToUser[Context.ConnectionId] = userId;
            
            if (!_onlineUsers.ContainsKey(userId))
            {
                _onlineUsers[userId] = new HashSet<string>();
            }
            _onlineUsers[userId].Add(Context.ConnectionId);
            
            // Notify others that this user came online (if first connection)
            if (_onlineUsers[userId].Count == 1)
            {
                await Clients.All.UserOnlineStatusChanged(userId, true);
            }
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_connectionToUser.TryGetValue(Context.ConnectionId, out var userId))
        {
            // Remove from user group
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            
            // Update online status
            if (_onlineUsers.ContainsKey(userId))
            {
                _onlineUsers[userId].Remove(Context.ConnectionId);
                
                // If no more connections for this user, mark as offline
                if (_onlineUsers[userId].Count == 0)
                {
                    _onlineUsers.TryRemove(userId, out _);
                    await Clients.All.UserOnlineStatusChanged(userId, false);
                }
            }
            
            _connectionToUser.TryRemove(Context.ConnectionId, out _);
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinChat(string chatGroupId)
    {
        Console.WriteLine($"[SignalR] JoinChat called - ConnectionId: {Context.ConnectionId}, ChatGroupId: {chatGroupId}");
        await Groups.AddToGroupAsync(Context.ConnectionId, $"chat_{chatGroupId}");
        Console.WriteLine($"[SignalR] User joined chat group: chat_{chatGroupId}");
    }

    public async Task LeaveChat(string chatGroupId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"chat_{chatGroupId}");
    }

    public async Task SendMessage(string chatGroupId, string content)
    {
        Console.WriteLine($"[SignalR] SendMessage called - ChatGroupId: {chatGroupId}, Content: {content}");
        
        // Get user ID from SignalR context instead of CurrentUserService
        var userIdClaim = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            Console.WriteLine($"[SignalR] User not authenticated or invalid user ID");
            await Clients.Caller.ReceiveMessage(new ConnectCampus.Application.Features.Chat.SendMessage.ChatMessageDto 
            { 
                Content = "Authentication failed", 
                SenderName = "System",
                SenderType = "System"
            });
            return;
        }

        Console.WriteLine($"[SignalR] Authenticated user ID: {userId}");
        
        // Use a fresh scope to avoid database context issues
        using var scope = _serviceProvider.CreateScope();
        var scopedDbContext = scope.ServiceProvider.GetRequiredService<IDbContext>();
        var scopedUnitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        
        // Parse the chat group ID
        var chatGroupId_guid = Guid.Parse(chatGroupId);
        Console.WriteLine($"[SignalR] Looking for chat group with ID: {chatGroupId_guid}");
        
        // Try direct database query first with explicit connection
        var chatGroup = await scopedDbContext.Set<ConnectCampus.Domain.Entities.ChatGroup>()
            .Include(cg => cg.Messages)
            .FirstOrDefaultAsync(cg => cg.Id == chatGroupId_guid);
        
        // Debug: Check if we can see any chat groups at all
        if (chatGroup == null)
        {
            Console.WriteLine($"[SignalR] Chat group not found with direct query, checking database connection...");
            var allGroups = await scopedDbContext.Set<ConnectCampus.Domain.Entities.ChatGroup>()
                .Select(cg => new { cg.Id, cg.StudentId, cg.AssociationId })
                .ToListAsync();
            Console.WriteLine($"[SignalR] All chat groups in database: {string.Join(", ", allGroups.Select(g => $"{g.Id} (S:{g.StudentId}, A:{g.AssociationId})"))}");
            
            // Try to find the specific group with a broader query
            var specificGroup = await scopedDbContext.Set<ConnectCampus.Domain.Entities.ChatGroup>()
                .Where(cg => cg.Id.ToString().ToLower() == chatGroupId.ToLower())
                .FirstOrDefaultAsync();
            
            if (specificGroup != null)
            {
                Console.WriteLine($"[SignalR] Found chat group with string comparison: {specificGroup.Id}");
                chatGroup = await scopedDbContext.Set<ConnectCampus.Domain.Entities.ChatGroup>()
                    .Include(cg => cg.Messages)
                    .FirstOrDefaultAsync(cg => cg.Id == specificGroup.Id);
            }
        }
            
        if (chatGroup == null)
        {
            Console.WriteLine($"[SignalR] Chat group not found: {chatGroupId}");
            Console.WriteLine($"[SignalR] Attempted to find chat group with GUID: {chatGroupId_guid}");
            
            // Try to list all chat groups for debugging
            var allGroups = await scopedDbContext.Set<ConnectCampus.Domain.Entities.ChatGroup>()
                .AsNoTracking()
                .Select(cg => new { cg.Id, cg.StudentId, cg.AssociationId })
                .ToListAsync();
            Console.WriteLine($"[SignalR] All chat groups in database: {string.Join(", ", allGroups.Select(g => g.Id))}");
            
            return;
        }

        Console.WriteLine($"[SignalR] Chat group found successfully. Student: {chatGroup.StudentId}, Association: {chatGroup.AssociationId}");

        // Get the current user's Student or Association ID to check membership
        var currentUserStudent = await scopedDbContext.Set<ConnectCampus.Domain.Entities.Student>()
            .FirstOrDefaultAsync(s => s.UserId == userId);
        
        var currentUserAssociation = await scopedDbContext.Set<ConnectCampus.Domain.Entities.Association>()
            .FirstOrDefaultAsync(a => a.UserId == userId);

        bool isMember = (currentUserStudent != null && chatGroup.StudentId == currentUserStudent.Id) ||
                       (currentUserAssociation != null && chatGroup.AssociationId == currentUserAssociation.Id);

        if (!isMember)
        {
            Console.WriteLine($"[SignalR] User {userId} (Student: {currentUserStudent?.Id}, Association: {currentUserAssociation?.Id}) is not a member of chat group {chatGroupId}");
            return;
        }

        Console.WriteLine($"[SignalR] User {userId} is a valid member, adding message...");

        // Create the message directly and add it to the database context
        var newMessage = new ConnectCampus.Domain.Entities.ChatMessage(chatGroup.Id, userId, content);
        await scopedDbContext.Set<ConnectCampus.Domain.Entities.ChatMessage>().AddAsync(newMessage);
        
        // Update the chat group's last message time
        chatGroup.UpdateLastMessageTime();
        scopedDbContext.Set<ConnectCampus.Domain.Entities.ChatGroup>().Update(chatGroup);
        
        Console.WriteLine($"[SignalR] Message added to database context, saving changes...");
        await scopedUnitOfWork.SaveChangesAsync();
        Console.WriteLine($"[SignalR] Changes saved successfully");
        
        // Get sender profile information (reuse the variables we already fetched)
        string senderName = "Unknown";
        string? senderAvatarUrl = null;
        string senderType = "Unknown";

        if (currentUserStudent != null)
        {
            senderName = $"{currentUserStudent.FirstName} {currentUserStudent.LastName}";
            senderAvatarUrl = currentUserStudent.AvatarUrl;
            senderType = "Student";
        }
        else if (currentUserAssociation != null)
        {
            senderName = currentUserAssociation.Name;
            senderAvatarUrl = currentUserAssociation.Logo;
            senderType = "Association";
        }

        var messageDto = new ConnectCampus.Application.Features.Chat.SendMessage.ChatMessageDto
        {
            Id = newMessage.Id,
            ChatGroupId = newMessage.ChatGroupId,
            SenderId = newMessage.SenderId,
            Content = newMessage.Content,
            SentAt = newMessage.SentAt,
            IsRead = newMessage.IsRead,
            SenderName = senderName,
            SenderAvatarUrl = senderAvatarUrl,
            SenderType = senderType
        };

        Console.WriteLine($"[SignalR] Message saved successfully, broadcasting to group: chat_{chatGroupId}");
        Console.WriteLine($"[SignalR] Message data: {System.Text.Json.JsonSerializer.Serialize(messageDto)}");
        
        // Broadcast message to all users in the chat group
        await Clients.Group($"chat_{chatGroupId}").ReceiveMessage(messageDto);
        
        // Also notify about unread count updates to users who are not the sender
        // We need to get the other participant's user ID
        string otherParticipantUserId = null;
        if (currentUserStudent != null)
        {
            // Current user is student, other participant is association
            var association = await scopedDbContext.Set<ConnectCampus.Domain.Entities.Association>()
                .FirstOrDefaultAsync(a => a.Id == chatGroup.AssociationId);
            otherParticipantUserId = association?.UserId.ToString();
        }
        else if (currentUserAssociation != null)
        {
            // Current user is association, other participant is student
            var student = await scopedDbContext.Set<ConnectCampus.Domain.Entities.Student>()
                .FirstOrDefaultAsync(s => s.Id == chatGroup.StudentId);
            otherParticipantUserId = student?.UserId.ToString();
        }

        // Send unread count update to the other participant
        if (!string.IsNullOrEmpty(otherParticipantUserId))
        {
            try
            {
                // Get notification hub context to send unread count updates
                var notificationHubContext = scope.ServiceProvider.GetRequiredService<INotificationHubContext>();
                
                // Calculate unread count for the other participant
                var otherParticipantUnreadCount = await CalculateUnreadCountForUser(Guid.Parse(otherParticipantUserId), scopedDbContext);
                await notificationHubContext.NotifyUnreadCountUpdated(otherParticipantUserId, otherParticipantUnreadCount);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SignalR] Failed to send unread count update: {ex.Message}");
            }
        }
        
        Console.WriteLine($"[SignalR] Message broadcasted successfully");
    }
    
    private static async Task<int> CalculateUnreadCountForUser(Guid userId, IDbContext dbContext)
    {
        // Get the current user's Student or Association ID
        var currentUserStudent = await dbContext.Set<ConnectCampus.Domain.Entities.Student>()
            .FirstOrDefaultAsync(s => s.UserId == userId);
        
        var currentUserAssociation = await dbContext.Set<ConnectCampus.Domain.Entities.Association>()
            .FirstOrDefaultAsync(a => a.UserId == userId);

        if (currentUserStudent != null)
        {
            // User is a student - count unread messages in all their chat groups
            return await dbContext.Set<ConnectCampus.Domain.Entities.ChatMessage>()
                .Join(dbContext.Set<ConnectCampus.Domain.Entities.ChatGroup>(),
                      message => message.ChatGroupId,
                      chatGroup => chatGroup.Id,
                      (message, chatGroup) => new { message, chatGroup })
                .Where(x => x.chatGroup.StudentId == currentUserStudent.Id && 
                           !x.message.IsRead && 
                           x.message.SenderId != userId)
                .CountAsync();
        }
        else if (currentUserAssociation != null)
        {
            // User is an association - count unread messages in all their chat groups
            return await dbContext.Set<ConnectCampus.Domain.Entities.ChatMessage>()
                .Join(dbContext.Set<ConnectCampus.Domain.Entities.ChatGroup>(),
                      message => message.ChatGroupId,
                      chatGroup => chatGroup.Id,
                      (message, chatGroup) => new { message, chatGroup })
                .Where(x => x.chatGroup.AssociationId == currentUserAssociation.Id && 
                           !x.message.IsRead && 
                           x.message.SenderId != userId)
                .CountAsync();
        }

        return 0;
    }
    
    // Method to check if user is online
    public async Task CheckUserOnlineStatus(string userId)
    {
        var isOnline = _onlineUsers.ContainsKey(userId) && _onlineUsers[userId].Count > 0;
        await Clients.Caller.UserOnlineStatusChanged(userId, isOnline);
    }
    
    // Method to get all online users (for debugging)
    public async Task GetOnlineUsers()
    {
        var onlineUserIds = _onlineUsers.Keys.ToList();
        await Clients.Caller.OnlineUsersList(onlineUserIds);
    }
}

public interface IChatHub
{
    Task ReceiveMessage(ConnectCampus.Application.Features.Chat.SendMessage.ChatMessageDto message);
    Task UserOnlineStatusChanged(string userId, bool isOnline);
    Task OnlineUsersList(List<string> userIds);
}

// Keep the original NotificationHub for other notifications
public class NotificationHub : Hub<INotificationHub>
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            Console.WriteLine($"[NotificationHub] User {userId} connected with connection {Context.ConnectionId}");
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            Console.WriteLine($"[NotificationHub] User {userId} disconnected with connection {Context.ConnectionId}");
        }

        await base.OnDisconnectedAsync(exception);
    }
} 

// INotificationHub is defined in INotificationHub.cs 