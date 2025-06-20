using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IAssociationRepository : IRepository<Association>
    {
        Task<Association?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Association?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
        Task<Association?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Association>> ListAsync(CancellationToken cancellationToken = default);
        Task<PagedList<Association>> ListPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default);
        Task<IEnumerable<Association>> ListByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default);
        Task<IEnumerable<Association>> ListByCategoryAsync(string category, CancellationToken cancellationToken = default);
        Task<PagedList<Association>> ListByCategoryPagedAsync(string category, PaginationParams paginationParams, CancellationToken cancellationToken = default);
        Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default);
        Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default);
        Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default);
    }
} 