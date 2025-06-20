using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Chat.SendMessage;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Chat.GetMessages;

public class GetMessagesQueryHandler : IQueryHandler<GetMessagesQuery, PagedList<ChatMessageDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IDbContext _dbContext;

    public GetMessagesQueryHandler(
        ICurrentUserService currentUserService,
        IDbContext dbContext)
    {
        _currentUserService = currentUserService;
        _dbContext = dbContext;
    }

    public async Task<Maybe<PagedList<ChatMessageDto>>> Handle(GetMessagesQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        // Get the current user's Student or Association ID
        var currentUserStudent = await _dbContext.Set<Student>()
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
        
        var currentUserAssociation = await _dbContext.Set<Association>()
            .FirstOrDefaultAsync(a => a.UserId == userId, cancellationToken);

        // Check if user is member of this chat group
        var chatGroup = await _dbContext.Set<ChatGroup>()
            .FirstOrDefaultAsync(cg => cg.Id == request.ChatGroupId && 
                                      ((currentUserStudent != null && cg.StudentId == currentUserStudent.Id) || 
                                       (currentUserAssociation != null && cg.AssociationId == currentUserAssociation.Id)), 
                                cancellationToken);

        if (chatGroup == null)
        {
            return Maybe<PagedList<ChatMessageDto>>.None;
        }

        // Order by SentAt DESC for infinite scroll (newest first)
        var query = _dbContext.Set<ChatMessage>()
            .Where(m => m.ChatGroupId == request.ChatGroupId)
            .OrderByDescending(m => m.SentAt);

        var totalCount = await query.CountAsync(cancellationToken);

        // Get messages with sender information
        var messages = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(m => new
            {
                m.Id,
                m.SenderId,
                m.Content,
                m.SentAt,
                m.IsRead,
                IsFromCurrentUser = m.SenderId == userId
            })
            .ToListAsync(cancellationToken);

        // Get all unique sender IDs to optimize database queries
        var senderIds = messages.Select(m => m.SenderId).Distinct().ToList();
        
        // Batch load all students and associations
        var students = await _dbContext.Set<Student>()
            .Where(s => senderIds.Contains(s.UserId))
            .ToDictionaryAsync(s => s.UserId, s => new { s.FirstName, s.LastName, s.AvatarUrl }, cancellationToken);
            
        var associations = await _dbContext.Set<Association>()
            .Where(a => senderIds.Contains(a.UserId))
            .ToDictionaryAsync(a => a.UserId, a => new { a.Name, a.Logo }, cancellationToken);

        // Build message DTOs with optimized sender lookups
        var messageDtos = messages.Select(message =>
        {
            string senderName = "Unknown";
            string? senderAvatarUrl = null;
            string senderType = "Unknown";

            // Check if sender is a student
            if (students.TryGetValue(message.SenderId, out var student))
            {
                senderName = $"{student.FirstName} {student.LastName}";
                senderAvatarUrl = student.AvatarUrl;
                senderType = "Student";
            }
            // Check if sender is an association
            else if (associations.TryGetValue(message.SenderId, out var association))
            {
                senderName = association.Name;
                senderAvatarUrl = association.Logo;
                senderType = "Association";
            }

            return new ChatMessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                Content = message.Content,
                SentAt = message.SentAt,
                IsRead = message.IsRead,
                IsFromCurrentUser = message.IsFromCurrentUser,
                SenderName = senderName,
                SenderAvatarUrl = senderAvatarUrl,
                SenderType = senderType
            };
        }).ToList();

        var pagedList = new PagedList<ChatMessageDto>(
            messageDtos,
            request.PageNumber,
            request.PageSize,
            totalCount);

        return pagedList;
    }
} 