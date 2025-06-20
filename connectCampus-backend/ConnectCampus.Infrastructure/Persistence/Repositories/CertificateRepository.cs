using Microsoft.EntityFrameworkCore;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Infrastructure.Persistence.Repositories;

public class CertificateRepository : Repository<Certificate>, ICertificateRepository
{
    public CertificateRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Certificate?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Context.Certificates
            .FindAsync([id], cancellationToken);
    }

    public async Task<IEnumerable<Certificate>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await Context.Certificates
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }
} 