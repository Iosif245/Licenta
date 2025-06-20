using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IEventRepository : IRepository<Event>
    {
        Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Event?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
        Task<List<Event>> GetByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default);
        Task<List<Event>> GetUpcomingEventsAsync(int count = 10, CancellationToken cancellationToken = default);
        Task<List<Event>> GetFeaturedEventsAsync(int count = 5, CancellationToken cancellationToken = default);
        Task<List<Event>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
        Task<List<Event>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default);
        Task<List<Event>> GetByTypeAsync(EventType type, CancellationToken cancellationToken = default);
        Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default);
        Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<int> GetEventsCountByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default);
        Task<int> GetUpcomingEventsCountByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default);
    }
} 