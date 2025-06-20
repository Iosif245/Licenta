using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories;

public interface ICertificateRepository : IRepository<Certificate>
{
    Task<Certificate?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Certificate>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
} 