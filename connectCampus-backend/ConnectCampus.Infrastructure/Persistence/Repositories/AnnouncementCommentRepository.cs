using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class AnnouncementCommentRepository : Repository<AnnouncementComment>, IAnnouncementCommentRepository
    {
        private readonly ILogger<AnnouncementCommentRepository> _logger;

        public AnnouncementCommentRepository(ApplicationDbContext context, ILogger<AnnouncementCommentRepository> logger) : base(context)
        {
            _logger = logger;
        }

        public async Task<AnnouncementComment?> GetByIdAsync(
            Guid id, 
            CancellationToken cancellationToken = default)
        {
            return await Context.AnnouncementComments
                .Include(ac => ac.Replies)
                    .ThenInclude(r => r.Replies)
                        .ThenInclude(r => r.Replies)
                            .ThenInclude(r => r.Replies)
                                .ThenInclude(r => r.Replies)
                                    .ThenInclude(r => r.Replies) // Support up to 6 levels of nesting
                .FirstOrDefaultAsync(ac => ac.Id == id, cancellationToken);
        }

        public async Task<List<AnnouncementComment>> GetByAnnouncementIdAsync(
            Guid announcementId, 
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Loading comments for announcement {AnnouncementId}", announcementId);
            
            // Load ALL comments for this announcement (both top-level and replies)
            var allComments = await Context.AnnouncementComments
                .Where(ac => ac.AnnouncementId == announcementId)
                .OrderBy(ac => ac.CreatedAt)
                .ToListAsync(cancellationToken);

            _logger.LogInformation("Loaded {Count} total comments for announcement {AnnouncementId}", allComments.Count, announcementId);

            // Build the hierarchy in memory
            var topLevelComments = allComments.Where(c => c.ParentCommentId == null).ToList();
            
            foreach (var comment in topLevelComments)
            {
                BuildRepliesHierarchy(comment, allComments);
            }

            _logger.LogInformation("Built hierarchy with {Count} top-level comments", topLevelComments.Count);
            
            return topLevelComments;
        }

        private void BuildRepliesHierarchy(AnnouncementComment parentComment, List<AnnouncementComment> allComments)
        {
            var directReplies = allComments.Where(c => c.ParentCommentId == parentComment.Id).ToList();
            
            // Clear existing replies and add the loaded ones
            parentComment.Replies.Clear();
            foreach (var reply in directReplies)
            {
                parentComment.Replies.Add(reply);
                // Recursively build replies for this reply
                BuildRepliesHierarchy(reply, allComments);
            }
        }

        public async Task<List<AnnouncementComment>> GetRepliesByParentIdAsync(
            Guid parentCommentId, 
            CancellationToken cancellationToken = default)
        {
            return await Context.AnnouncementComments
                .Where(ac => ac.ParentCommentId == parentCommentId)
                .OrderBy(ac => ac.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<int> GetCommentCountAsync(
            Guid announcementId, 
            CancellationToken cancellationToken = default)
        {
            return await Context.AnnouncementComments
                .CountAsync(ac => ac.AnnouncementId == announcementId, cancellationToken);
        }
    }
} 