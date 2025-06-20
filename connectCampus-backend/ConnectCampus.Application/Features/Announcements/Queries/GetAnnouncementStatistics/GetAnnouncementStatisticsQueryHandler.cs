using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Announcements.Dtos;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementStatistics
{
    public class GetAnnouncementStatisticsQueryHandler : IQueryHandler<GetAnnouncementStatisticsQuery, AnnouncementStatisticsDto>
    {
        private readonly IDbContext _dbContext;

        public GetAnnouncementStatisticsQueryHandler(IDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Maybe<AnnouncementStatisticsDto>> Handle(GetAnnouncementStatisticsQuery request, CancellationToken cancellationToken)
        {
            // Get all likes for the announcement
            var likes = await _dbContext.Set<AnnouncementLike>()
                .Where(al => al.AnnouncementId == request.AnnouncementId)
                .ToListAsync(cancellationToken);

            // Get all comments for the announcement
            var comments = await _dbContext.Set<AnnouncementComment>()
                .Where(ac => ac.AnnouncementId == request.AnnouncementId)
                .ToListAsync(cancellationToken);

            // Calculate statistics
            var totalLikes = likes.Count;
            var studentLikes = likes.Count(l => l.AuthorType == AuthorType.Student);
            var associationLikes = likes.Count(l => l.AuthorType == AuthorType.Association);

            var totalComments = comments.Count;
            var totalReplies = comments.Count(c => c.ParentCommentId.HasValue);
            var studentComments = comments.Count(c => c.AuthorType == AuthorType.Student);
            var associationComments = comments.Count(c => c.AuthorType == AuthorType.Association);

            // Get last interaction date
            var lastLikeDate = likes.Any() ? likes.Max(l => l.CreatedAt) : (DateTime?)null;
            var lastCommentDate = comments.Any() ? comments.Max(c => c.CreatedAt) : (DateTime?)null;
            
            DateTime? lastInteractionDate = null;
            if (lastLikeDate.HasValue && lastCommentDate.HasValue)
            {
                lastInteractionDate = lastLikeDate > lastCommentDate ? lastLikeDate : lastCommentDate;
            }
            else if (lastLikeDate.HasValue)
            {
                lastInteractionDate = lastLikeDate;
            }
            else if (lastCommentDate.HasValue)
            {
                lastInteractionDate = lastCommentDate;
            }

            return new AnnouncementStatisticsDto(
                request.AnnouncementId,
                totalLikes,
                totalComments,
                totalReplies,
                studentLikes,
                associationLikes,
                studentComments,
                associationComments,
                lastInteractionDate
            );
        }
    }
} 
 
 