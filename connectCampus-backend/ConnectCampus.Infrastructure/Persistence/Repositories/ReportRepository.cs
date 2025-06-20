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
    public class ReportRepository : Repository<Report>, IReportRepository
    {
        public ReportRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Report?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Reports
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
        }

        public async Task<List<Report>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await Context.Reports
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Report>> GetByStatusAsync(ReportStatus status, CancellationToken cancellationToken = default)
        {
            return await Context.Reports
                .Where(r => r.Status == status)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Report>> GetByTargetAsync(Guid targetId, string targetType, CancellationToken cancellationToken = default)
        {
            return await Context.Reports
                .Where(r => r.TargetId == targetId && r.TargetType == targetType)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Report>> ListAsync(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
        {
            return await Context.Reports
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(r => r.User)
                .ToListAsync(cancellationToken);
        }

        public async Task<int> GetTotalCountAsync(CancellationToken cancellationToken = default)
        {
            return await Context.Reports.CountAsync(cancellationToken);
        }

        public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Reports.AnyAsync(r => r.Id == id, cancellationToken);
        }
    }
} 