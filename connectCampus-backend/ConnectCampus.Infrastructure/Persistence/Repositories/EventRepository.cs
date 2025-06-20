using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class EventRepository : Repository<Event>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Events
                .Include(e => e.Association)
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        }

        public async Task<Event?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            return await Context.Events
                .Include(e => e.Association)
                .FirstOrDefaultAsync(e => e.Slug == slug, cancellationToken);
        }

        public async Task<List<Event>> GetByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default)
        {
            return await Context.Events
                .Where(e => e.AssociationId == associationId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Event>> GetUpcomingEventsAsync(int count = 10, CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow;
            return await Context.Events
                .Where(e => e.StartDate > now && e.Status == EventStatus.Published)
                .OrderBy(e => e.StartDate)
                .Take(count)
                .Include(e => e.Association)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Event>> GetFeaturedEventsAsync(int count = 5, CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow;
            return await Context.Events
                .Where(e => e.IsFeatured && e.Status == EventStatus.Published && e.StartDate > now)
                .OrderBy(e => e.StartDate)
                .Take(count)
                .Include(e => e.Association)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Event>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
        {
            return await Context.Events
                .Where(e => e.StartDate >= startDate && e.EndDate <= endDate && e.Status == EventStatus.Published)
                .OrderBy(e => e.StartDate)
                .Include(e => e.Association)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Event>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default)
        {
            return await Context.Events
                .Where(e => e.Category == category && e.Status == EventStatus.Published)
                .OrderBy(e => e.StartDate)
                .Include(e => e.Association)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Event>> GetByTypeAsync(EventType type, CancellationToken cancellationToken = default)
        {
            return await Context.Events
                .Where(e => e.Type == type && e.Status == EventStatus.Published)
                .OrderBy(e => e.StartDate)
                .Include(e => e.Association)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            return await Context.Events.AnyAsync(e => e.Slug == slug, cancellationToken);
        }

        public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Events.AnyAsync(e => e.Id == id, cancellationToken);
        }

        public async Task<int> GetEventsCountByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default)
        {
            return await Context.Events.CountAsync(e => e.AssociationId == associationId, cancellationToken);
        }

        public async Task<int> GetUpcomingEventsCountByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow;
            return await Context.Events.CountAsync(e => 
                e.AssociationId == associationId && 
                e.StartDate > now && 
                e.Status == EventStatus.Published, 
                cancellationToken);
        }
    }
} 