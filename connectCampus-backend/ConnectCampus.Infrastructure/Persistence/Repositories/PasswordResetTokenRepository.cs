using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class PasswordResetTokenRepository : Repository<PasswordResetToken>, IPasswordResetTokenRepository
    {
        public PasswordResetTokenRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<PasswordResetToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default)
        {
            return await Context.PasswordResetTokens
                .Include(prt => prt.User)
                .FirstOrDefaultAsync(prt => prt.Token == token, cancellationToken);
        }

        public async Task<PasswordResetToken?> GetValidTokenByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await Context.PasswordResetTokens
                .Where(prt => prt.UserId == userId && !prt.IsUsed && prt.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(prt => prt.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task InvalidateAllTokensForUserAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var tokens = await Context.PasswordResetTokens
                .Where(prt => prt.UserId == userId && !prt.IsUsed)
                .ToListAsync(cancellationToken);

            foreach (var token in tokens)
            {
                token.MarkAsUsed();
            }
        }
    }
} 