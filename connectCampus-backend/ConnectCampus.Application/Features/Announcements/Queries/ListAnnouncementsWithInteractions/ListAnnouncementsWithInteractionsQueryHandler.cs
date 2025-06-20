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

namespace ConnectCampus.Application.Features.Announcements.Queries.ListAnnouncementsWithInteractions
{
    public class ListAnnouncementsWithInteractionsQueryHandler : IQueryHandler<ListAnnouncementsWithInteractionsQuery, List<AnnouncementSummaryWithInteractionsDto>>
    {
        private readonly IDbContext _dbContext;
        private readonly IAnnouncementLikeRepository _likeRepository;
        private readonly IAnnouncementCommentRepository _commentRepository;

        public ListAnnouncementsWithInteractionsQueryHandler(
            IDbContext dbContext,
            IAnnouncementLikeRepository likeRepository,
            IAnnouncementCommentRepository commentRepository)
        {
            _dbContext = dbContext;
            _likeRepository = likeRepository;
            _commentRepository = commentRepository;
        }

        public async Task<Maybe<List<AnnouncementSummaryWithInteractionsDto>>> Handle(ListAnnouncementsWithInteractionsQuery request, CancellationToken cancellationToken)
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
            
            // Get interaction counts for each announcement
            var dtos = new List<AnnouncementSummaryWithInteractionsDto>();
            
            foreach (var announcement in announcements)
            {
                var likeCount = await _likeRepository.GetLikeCountAsync(announcement.Id, cancellationToken);
                var commentCount = await _commentRepository.GetCommentCountAsync(announcement.Id, cancellationToken);
                
                // Check if user liked this announcement
                bool isLikedByUser = false;
                if (request.UserId.HasValue && request.UserType != null)
                {
                    isLikedByUser = await _likeRepository.ExistsAsync(
                        announcement.Id,
                        request.UserId.Value,
                        request.UserType,
                        cancellationToken);
                }
                
                dtos.Add(new AnnouncementSummaryWithInteractionsDto(
                    announcement.Id,
                    announcement.Title,
                    announcement.Content,
                    announcement.ImageUrl,
                    announcement.PublishedDate,
                    announcement.Association?.Name ?? "Unknown Association",
                    announcement.AssociationId,
                    likeCount,
                    commentCount,
                    isLikedByUser
                ));
            }
            
            return dtos;
        }
    }
} 
 
 