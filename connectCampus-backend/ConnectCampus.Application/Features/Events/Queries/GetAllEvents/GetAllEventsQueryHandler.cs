using ConnectCampus.Application.Abstractions;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Events.Queries.GetAllEvents;

public class GetAllEventsQueryHandler : IQueryHandler<GetAllEventsQuery, List<EventSummaryDto>>
{
    private readonly IDbContext _dbContext;

    public GetAllEventsQueryHandler(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Maybe<List<EventSummaryDto>>> Handle(GetAllEventsQuery request, CancellationToken cancellationToken)
    {
        // Start with base query - only published events
        var query = _dbContext.Set<Event>()
            .Where(e => e.Status == EventStatus.Published)
            .AsQueryable();
        
        // Apply featured filter if provided
        if (request.Featured.HasValue)
        {
            query = query.Where(e => e.IsFeatured == request.Featured.Value);
        }
        
        // Apply category filter if provided
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(e => e.Category == request.Category);
        }
        
        // Apply type filter if provided
        if (request.Type.HasValue)
        {
            query = query.Where(e => e.Type == request.Type.Value);
        }
        
        // Apply search filter if provided
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(e => 
                e.Title.Contains(request.Search) || 
                e.Description.Contains(request.Search) ||
                e.AssociationName.Contains(request.Search)
            );
        }
        
        // Apply location filter if provided
        if (!string.IsNullOrEmpty(request.Location))
        {
            query = query.Where(e => e.Location.Contains(request.Location));
        }
        
        // Apply ordering by start date
        query = query.OrderBy(e => e.StartDate);
        
        // Get all matching events (no pagination)
        var events = await query.ToListAsync(cancellationToken);
        
        // Map to DTOs
        var eventDtos = events.Select(e => new EventSummaryDto(
            e.Id,
            e.Title,
            e.Slug,
            e.Description,
            e.CoverImageUrl,
            e.StartDate,
            e.EndDate,
            e.Location,
            e.Category,
            e.Tags,
            e.IsFeatured,
            e.Price,
            e.IsFree,
            e.Status.ToString(),
            e.AttendeesCount,
            e.AssociationName,
            e.AssociationLogo,
            e.Type.ToString(),
            e.AssociationId
        )).ToList();
        
        return eventDtos;
    }
} 