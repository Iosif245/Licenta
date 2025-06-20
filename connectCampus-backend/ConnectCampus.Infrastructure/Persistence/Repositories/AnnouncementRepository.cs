using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class AnnouncementRepository : Repository<Announcement>, IAnnouncementRepository
    {
        public AnnouncementRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Announcement?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Announcements
                .Include(a => a.Association)
                .Include(a => a.Event)
                .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        }

        public async Task<List<Announcement>> GetByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default)
        {
            return await Context.Announcements
                .Where(a => a.AssociationId == associationId)
                .OrderByDescending(a => a.PublishedDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Announcement>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
        {
            return await Context.Announcements
                .Where(a => a.EventId == eventId)
                .OrderByDescending(a => a.PublishedDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Announcement>> GetRecentAsync(int count = 10, CancellationToken cancellationToken = default)
        {
            return await Context.Announcements
                .OrderByDescending(a => a.PublishedDate)
                .Take(count)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Announcements
                .AnyAsync(a => a.Id == id, cancellationToken);
        }
    }
} 