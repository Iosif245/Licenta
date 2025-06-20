using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Chat.GetChatGroups;

public class GetChatGroupsQueryHandler : IQueryHandler<GetChatGroupsQuery, PagedList<ChatGroupDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IDbContext _dbContext;

    public GetChatGroupsQueryHandler(
        ICurrentUserService currentUserService, 
        IDbContext dbContext)
    {
        _currentUserService = currentUserService;
        _dbContext = dbContext;
    }

    public async Task<Maybe<PagedList<ChatGroupDto>>> Handle(GetChatGroupsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == null)
        {
            return Maybe<PagedList<ChatGroupDto>>.None;
        }
        
        // Get the current user's Student or Association ID
        var student = await _dbContext.Set<Student>()
            .FirstOrDefaultAsync(s => s.UserId == userId.Value, cancellationToken);
            
        var association = await _dbContext.Set<Association>()
            .FirstOrDefaultAsync(a => a.UserId == userId.Value, cancellationToken);
        
        if (student == null && association == null)
        {
            return new PagedList<ChatGroupDto>(new List<ChatGroupDto>(), 1, request.PageSize, 0);
        }
        
        var query = _dbContext.Set<ChatGroup>()
            .Include(cg => cg.Student)
            .Include(cg => cg.Association)
            .Where(cg => (student != null && cg.StudentId == student.Id) || 
                        (association != null && cg.AssociationId == association.Id))
            .OrderByDescending(cg => cg.LastMessageAt ?? cg.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        
        var chatGroups = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(cg => new ChatGroupDto
            {
                Id = cg.Id,
                StudentId = cg.StudentId,
                AssociationId = cg.AssociationId,
                EventId = cg.EventId,
                CreatedAt = cg.CreatedAt,
                LastMessageAt = cg.LastMessageAt,
                UnreadCount = 0, // Will be calculated separately to avoid N+1 queries
                StudentName = cg.Student != null ? $"{cg.Student.FirstName} {cg.Student.LastName}" : null,
                StudentAvatarUrl = cg.Student != null ? cg.Student.AvatarUrl : null,
                AssociationName = cg.Association != null ? cg.Association.Name : null,
                AssociationAvatarUrl = cg.Association != null ? cg.Association.Logo : null
            })
            .ToListAsync(cancellationToken);

        // Calculate unread count for each chat group
        foreach (var chatGroupDto in chatGroups)
        {
            var unreadCount = await _dbContext.Set<ChatMessage>()
                .CountAsync(m => m.ChatGroupId == chatGroupDto.Id && 
                                !m.IsRead && 
                                m.SenderId != userId.Value, 
                           cancellationToken);
            chatGroupDto.UnreadCount = unreadCount;
        }

        var pagedList = new PagedList<ChatGroupDto>(
            chatGroups,
            request.PageNumber,
            request.PageSize,
            totalCount);

        return pagedList;
    }
}

public class ChatGroupDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid AssociationId { get; set; }
    public Guid? EventId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public int UnreadCount { get; set; }
    public string? StudentName { get; set; }
    public string? StudentAvatarUrl { get; set; }
    public string? AssociationName { get; set; }
    public string? AssociationAvatarUrl { get; set; }
} 