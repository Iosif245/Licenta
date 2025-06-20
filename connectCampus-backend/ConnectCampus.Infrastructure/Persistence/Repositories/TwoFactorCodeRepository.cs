using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class TwoFactorCodeRepository : Repository<TwoFactorCode>, ITwoFactorCodeRepository
    {
        public TwoFactorCodeRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<TwoFactorCode?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
        {
            return await Context.TwoFactorCodes
                .Include(tfc => tfc.User)
                .FirstOrDefaultAsync(tfc => tfc.Code == code, cancellationToken);
        }

        public async Task<TwoFactorCode?> GetLatestByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await Context.TwoFactorCodes
                .Where(tfc => tfc.UserId == userId)
                .OrderByDescending(tfc => tfc.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task InvalidateAllCodesForUserAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var codes = await Context.TwoFactorCodes
                .Where(tfc => tfc.UserId == userId && !tfc.IsUsed)
                .ToListAsync(cancellationToken);

            foreach (var code in codes)
            {
                code.MarkAsUsed();
            }
        }
    }
} 