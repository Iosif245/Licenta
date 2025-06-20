using Microsoft.EntityFrameworkCore.Storage;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
    }
} 