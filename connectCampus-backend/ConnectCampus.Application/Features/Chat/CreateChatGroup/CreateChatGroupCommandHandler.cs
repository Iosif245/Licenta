using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Chat.GetChatGroups;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Chat.CreateChatGroup;

public class CreateChatGroupCommandHandler : ICommandHandler<CreateChatGroupCommand, ChatGroupDto>
{
    private readonly IChatGroupRepository _chatGroupRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDbContext _dbContext;

    public CreateChatGroupCommandHandler(
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

    public async Task<Result<ChatGroupDto>> Handle(CreateChatGroupCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        
        if (userId == null)
        {
            return Result.Failure<ChatGroupDto>(Error.Unauthorized("User.NotAuthenticated", "User is not authenticated"));
        }

        // Get the current user's Student or Association ID
        var student = await _dbContext.Set<Student>()
            .FirstOrDefaultAsync(s => s.UserId == userId.Value, cancellationToken);
        
        var association = await _dbContext.Set<Association>()
            .FirstOrDefaultAsync(a => a.UserId == userId.Value, cancellationToken);

        Guid? currentUserStudentId = student?.Id;
        Guid? currentUserAssociationId = association?.Id;

        // Check if user is either the student or association in the chat group
        if (currentUserStudentId != request.StudentId && currentUserAssociationId != request.AssociationId)
        {
            return Result.Failure<ChatGroupDto>(Error.Forbidden());
        }

        // Check if chat group already exists
        var existingChatGroup = await _chatGroupRepository.GetByParticipantsAsync(request.StudentId, request.AssociationId, cancellationToken);
        if (existingChatGroup != null)
        {
            // Return existing chat group
            return Result.Success(new ChatGroupDto
            {
                Id = existingChatGroup.Id,
                StudentId = existingChatGroup.StudentId,
                AssociationId = existingChatGroup.AssociationId,
                EventId = existingChatGroup.EventId,
                CreatedAt = existingChatGroup.CreatedAt,
                LastMessageAt = existingChatGroup.LastMessageAt,
                UnreadCount = existingChatGroup.HasUnreadMessages(userId.Value) ? 1 : 0
            });
        }

        // Create new chat group
        var chatGroup = new ChatGroup(request.StudentId, request.AssociationId, request.EventId);
        
        await _chatGroupRepository.AddAsync(chatGroup, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var chatGroupDto = new ChatGroupDto
        {
            Id = chatGroup.Id,
            StudentId = chatGroup.StudentId,
            AssociationId = chatGroup.AssociationId,
            EventId = chatGroup.EventId,
            CreatedAt = chatGroup.CreatedAt,
            LastMessageAt = chatGroup.LastMessageAt,
            UnreadCount = 0
        };

        return Result.Success(chatGroupDto);
    }
} 