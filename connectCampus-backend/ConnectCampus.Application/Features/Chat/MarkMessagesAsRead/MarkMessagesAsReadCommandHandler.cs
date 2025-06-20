using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Chat.MarkMessagesAsRead;

public class MarkMessagesAsReadCommandHandler : ICommandHandler<MarkMessagesAsReadCommand>
{
    private readonly IDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationHubContext _notificationHubContext;

    public MarkMessagesAsReadCommandHandler(
        IDbContext dbContext,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        INotificationHubContext notificationHubContext)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _notificationHubContext = notificationHubContext;
    }

    public async Task<Result> Handle(MarkMessagesAsReadCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue)
        {
            return Result.Failure(Error.Unauthorized("User.NotAuthenticated", "User is not authenticated"));
        }

        // Get the chat group
        var chatGroup = await _dbContext.Set<ChatGroup>()
            .Include(cg => cg.Messages)
            .FirstOrDefaultAsync(cg => cg.Id == request.ChatGroupId, cancellationToken);

        if (chatGroup == null)
        {
            return Result.Failure(Error.NotFound("Chat.NotFound", "Chat group not found"));
        }

        // Verify user is part of this chat group
        var currentUserStudent = await _dbContext.Set<Student>()
            .FirstOrDefaultAsync(s => s.UserId == userId.Value, cancellationToken);
        
        var currentUserAssociation = await _dbContext.Set<Association>()
            .FirstOrDefaultAsync(a => a.UserId == userId.Value, cancellationToken);

        bool isParticipant = (currentUserStudent != null && chatGroup.StudentId == currentUserStudent.Id) ||
                           (currentUserAssociation != null && chatGroup.AssociationId == currentUserAssociation.Id);

        if (!isParticipant)
        {
            return Result.Failure(Error.Forbidden());
        }

        // Mark messages as read using the domain method
        chatGroup.MarkMessagesAsRead(userId.Value);

        // Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Calculate new unread count for the user
        var newUnreadCount = await CalculateUnreadCountForUser(userId.Value, cancellationToken);

        // Notify via SignalR that messages were marked as read
        try
        {
            await _notificationHubContext.NotifyMessagesMarkedAsRead(request.ChatGroupId);
            // Also notify about the updated unread count
            await _notificationHubContext.NotifyUnreadCountUpdated(userId.Value.ToString(), newUnreadCount);
        }
        catch (Exception ex)
        {
            // Log but don't fail the operation if SignalR fails
            // TODO: Add proper logging
            Console.WriteLine($"Failed to send SignalR notification: {ex.Message}");
        }

        return Result.Success();
    }

    private async Task<int> CalculateUnreadCountForUser(Guid userId, CancellationToken cancellationToken)
    {
        // Get the current user's Student or Association ID
        var currentUserStudent = await _dbContext.Set<Student>()
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
        
        var currentUserAssociation = await _dbContext.Set<Association>()
            .FirstOrDefaultAsync(a => a.UserId == userId, cancellationToken);

        if (currentUserStudent != null)
        {
            // User is a student - count unread messages in all their chat groups
            return await _dbContext.Set<ChatMessage>()
                .Join(_dbContext.Set<ChatGroup>(),
                      message => message.ChatGroupId,
                      chatGroup => chatGroup.Id,
                      (message, chatGroup) => new { message, chatGroup })
                .Where(x => x.chatGroup.StudentId == currentUserStudent.Id && 
                           !x.message.IsRead && 
                           x.message.SenderId != userId)
                .CountAsync(cancellationToken);
        }
        else if (currentUserAssociation != null)
        {
            // User is an association - count unread messages in all their chat groups
            return await _dbContext.Set<ChatMessage>()
                .Join(_dbContext.Set<ChatGroup>(),
                      message => message.ChatGroupId,
                      chatGroup => chatGroup.Id,
                      (message, chatGroup) => new { message, chatGroup })
                .Where(x => x.chatGroup.AssociationId == currentUserAssociation.Id && 
                           !x.message.IsRead && 
                           x.message.SenderId != userId)
                .CountAsync(cancellationToken);
        }

        return 0;
    }
} 