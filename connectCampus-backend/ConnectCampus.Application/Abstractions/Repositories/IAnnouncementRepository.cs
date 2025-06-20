using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IAnnouncementRepository : IRepository<Announcement>
    {
        Task<Announcement?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<Announcement>> GetByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default);
        Task<List<Announcement>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<List<Announcement>> GetRecentAsync(int count = 10, CancellationToken cancellationToken = default);
        Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default);
    }
} 