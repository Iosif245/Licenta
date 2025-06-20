using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Chat.SendMessage;

public class SendMessageCommandHandler : ICommandHandler<SendMessageCommand, ChatMessageDto>
{
    private readonly IChatGroupRepository _chatGroupRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDbContext _dbContext;

    public SendMessageCommandHandler(
        IChatGroupRepository chatGroupRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        IDbContext dbContext)
    {
        _chatGroupRepository = chatGroupRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _dbContext = dbContext;
    }

    public async Task<Result<ChatMessageDto>> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        
        if (userId == null)
        {
            return Result.Failure<ChatMessageDto>(Error.Unauthorized("User.NotAuthenticated", "User is not authenticated"));
        }

        // Get the chat group
        var chatGroup = await _chatGroupRepository.GetByIdAsync(request.ChatGroupId, cancellationToken);
        if (chatGroup == null)
        {
            return Result.Failure<ChatMessageDto>(Error.NotFound("Chat.NotFound", "Chat group not found"));
        }

        // Check if user is a member of this chat
        if (!chatGroup.IsMember(userId.Value))
        {
            return Result.Failure<ChatMessageDto>(Error.Forbidden());
        }

        // Add message to chat group
        chatGroup.AddMessage(userId.Value, request.Content);

        // Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Get the new message and sender information
        var newMessage = chatGroup.Messages.Last();
        
        // Get sender profile information
        string senderName = "Unknown";
        string? senderAvatarUrl = null;
        string senderType = "Unknown";

        // Try to find sender in Students table first
        var student = await _dbContext.Set<Student>()
            .FirstOrDefaultAsync(s => s.UserId == userId.Value, cancellationToken);
        
        if (student != null)
        {
            senderName = $"{student.FirstName} {student.LastName}";
            senderAvatarUrl = student.AvatarUrl;
            senderType = "Student";
        }
        else
        {
            // Try to find sender in Associations table
            var association = await _dbContext.Set<Association>()
                .FirstOrDefaultAsync(a => a.UserId == userId.Value, cancellationToken);
            
            if (association != null)
            {
                senderName = association.Name;
                senderAvatarUrl = association.Logo;
                senderType = "Association";
            }
        }

        var messageDto = new ChatMessageDto
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

        return Result.Success(messageDto);
    }
} 