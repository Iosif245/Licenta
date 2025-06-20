using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IStudentFavoriteEventRepository : IRepository<StudentFavoriteEvent>
    {
        Task<StudentFavoriteEvent?> GetByStudentAndEventAsync(Guid studentId, Guid eventId, CancellationToken cancellationToken = default);
        Task<List<StudentFavoriteEvent>> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
        Task<List<StudentFavoriteEvent>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<bool> ExistsByStudentAndEventAsync(Guid studentId, Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetFavoriteCountByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetFavoriteCountByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
    }
} 