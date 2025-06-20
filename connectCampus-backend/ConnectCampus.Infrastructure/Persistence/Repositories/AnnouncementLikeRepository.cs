using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class AnnouncementLikeRepository : Repository<AnnouncementLike>, IAnnouncementLikeRepository
    {
        public AnnouncementLikeRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<AnnouncementLike?> GetByAnnouncementAndAuthorAsync(
            Guid announcementId, 
            Guid authorId, 
            AuthorType authorType, 
            CancellationToken cancellationToken = default)
        {
            return await Context.AnnouncementLikes
                .FirstOrDefaultAsync(al => 
                    al.AnnouncementId == announcementId && 
                    al.AuthorId == authorId && 
                    al.AuthorType == authorType, 
                    cancellationToken);
        }

        public async Task<bool> ExistsAsync(
            Guid announcementId, 
            Guid authorId, 
            AuthorType authorType, 
            CancellationToken cancellationToken = default)
        {
            return await Context.AnnouncementLikes
                .AnyAsync(al => 
                    al.AnnouncementId == announcementId && 
                    al.AuthorId == authorId && 
                    al.AuthorType == authorType, 
                    cancellationToken);
        }

        public async Task<int> GetLikeCountAsync(
            Guid announcementId, 
            CancellationToken cancellationToken = default)
        {
            return await Context.AnnouncementLikes
                .CountAsync(al => al.AnnouncementId == announcementId, cancellationToken);
        }

        public async Task<List<AnnouncementLike>> GetLikesByAnnouncementAsync(
            Guid announcementId, 
            CancellationToken cancellationToken = default)
        {
            return await Context.AnnouncementLikes
                .Where(al => al.AnnouncementId == announcementId)
                .OrderByDescending(al => al.CreatedAt)
                .ToListAsync(cancellationToken);
        }
    }
} 