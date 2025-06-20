using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IRefreshTokenRepository : IRepository<RefreshToken>
    {
        Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
        Task<IEnumerable<RefreshToken>> GetActiveTokensByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    }
} 