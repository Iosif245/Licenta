using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IPasswordResetTokenRepository : IRepository<PasswordResetToken>
    {
        Task<PasswordResetToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
        Task<PasswordResetToken?> GetValidTokenByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task InvalidateAllTokensForUserAsync(Guid userId, CancellationToken cancellationToken = default);
    }
} 