using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IFollowRepository : IRepository<Follow>
    {
        Task<bool> ExistsAsync(Guid studentId, Guid associationId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Student>> GetFollowersByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default);
        Task<PagedList<Student>> GetFollowersByAssociationIdPagedAsync(Guid associationId, PaginationParams paginationParams, CancellationToken cancellationToken = default);
        Task<int> GetFollowersCountByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Association>> GetFollowedAssociationsByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
        Task<PagedList<Association>> GetFollowedAssociationsByStudentIdPagedAsync(Guid studentId, PaginationParams paginationParams, CancellationToken cancellationToken = default);
        Task<int> GetFollowedAssociationsCountByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
        Task<Follow?> GetAsync(Guid studentId, Guid associationId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Follow>> GetFollowsByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
    }
} 