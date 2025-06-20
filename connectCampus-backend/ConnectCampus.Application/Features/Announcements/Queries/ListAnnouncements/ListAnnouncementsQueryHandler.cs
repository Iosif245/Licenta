using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Announcements.Dtos;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Announcements.Queries.ListAnnouncements
{
    public class ListAnnouncementsQueryHandler : IQueryHandler<ListAnnouncementsQuery, List<AnnouncementSummaryDto>>
    {
        private readonly IDbContext _dbContext;

        public ListAnnouncementsQueryHandler(IDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Maybe<List<AnnouncementSummaryDto>>> Handle(ListAnnouncementsQuery request, CancellationToken cancellationToken)
        {
            // Start building the query
            var query = _dbContext.Set<Announcement>().AsQueryable();
            
            // Apply filters
            if (request.AssociationId.HasValue)
            {
                query = query.Where(a => a.AssociationId == request.AssociationId.Value);
            }
            
            if (request.EventId.HasValue)
            {
                query = query.Where(a => a.EventId == request.EventId.Value);
            }
            
            // Apply ordering
            query = query.OrderByDescending(a => a.PublishedDate);
            
            // Apply pagination
            var skip = (request.Page - 1) * request.PageSize;
            var announcements = await query
                .Skip(skip)
                .Take(request.PageSize)
                .Include(a => a.Association)
                .ToListAsync(cancellationToken);
            
            // Map to DTOs
            var dtos = announcements.Select(a => new AnnouncementSummaryDto(
                a.Id,
                a.Title,
                a.Content,
                a.ImageUrl,
                a.PublishedDate,
                a.Association?.Name ?? "Unknown Association",
                a.AssociationId
            )).ToList();
            
            return dtos;
        }
    }
} 