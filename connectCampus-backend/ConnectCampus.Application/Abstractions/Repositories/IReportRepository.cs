using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IReportRepository : IRepository<Report>
    {
        Task<Report?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<Report>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<List<Report>> GetByStatusAsync(ReportStatus status, CancellationToken cancellationToken = default);
        Task<List<Report>> GetByTargetAsync(Guid targetId, string targetType, CancellationToken cancellationToken = default);
        Task<List<Report>> ListAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default);
        Task<int> GetTotalCountAsync(CancellationToken cancellationToken = default);
        Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default);
    }
} 