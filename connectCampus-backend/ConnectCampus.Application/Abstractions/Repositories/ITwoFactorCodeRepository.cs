using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface ITwoFactorCodeRepository : IRepository<TwoFactorCode>
    {
        Task<TwoFactorCode?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
        Task<TwoFactorCode?> GetLatestByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task InvalidateAllCodesForUserAsync(Guid userId, CancellationToken cancellationToken = default);
    }
} 