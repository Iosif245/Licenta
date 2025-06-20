using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Events.Queries.ListEvents
{
    public class ListEventsQueryHandler : IQueryHandler<ListEventsQuery, List<EventSummaryDto>>
    {
        private readonly IDbContext _dbContext;

        public ListEventsQueryHandler(IDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Maybe<List<EventSummaryDto>>> Handle(ListEventsQuery request, CancellationToken cancellationToken)
        {
            // Start with base query
            var query = _dbContext.Set<Event>().AsQueryable();
            
            // Apply filters
            if (request.UpcomingOnly)
            {
                var now = DateTime.UtcNow;
                query = query.Where(e => e.StartDate > now && e.Status == EventStatus.Published);
            }
            else
            {
                // For non-upcoming events, still only return published ones
                query = query.Where(e => e.Status == EventStatus.Published);
            }
            
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
            
            // Apply ordering
            query = query.OrderBy(e => e.StartDate);
            
            // Apply pagination
            var skip = (request.Page - 1) * request.PageSize;
            var events = await query
                .Skip(skip)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);
            
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
} 