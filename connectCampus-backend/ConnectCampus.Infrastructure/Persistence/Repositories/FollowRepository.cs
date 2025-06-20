using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class FollowRepository : Repository<Follow>, IFollowRepository
    {
        public FollowRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<bool> ExistsAsync(Guid studentId, Guid associationId, CancellationToken cancellationToken = default)
        {
            return await Context.Follows
                .AnyAsync(f => f.StudentId == studentId && f.AssociationId == associationId, cancellationToken);
        }

        public async Task<Follow?> GetAsync(Guid studentId, Guid associationId, CancellationToken cancellationToken = default)
        {
            return await Context.Follows
                .FirstOrDefaultAsync(f => f.StudentId == studentId && f.AssociationId == associationId, cancellationToken);
        }

        public async Task<IEnumerable<Student>> GetFollowersByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default)
        {
            return await Context.Follows
                .Where(f => f.AssociationId == associationId)
                .Include(f => f.Student)
                .Select(f => f.Student)
                .OrderBy(s => s.FirstName)
                .ThenBy(s => s.LastName)
                .ToListAsync(cancellationToken);
        }

        public async Task<PagedList<Student>> GetFollowersByAssociationIdPagedAsync(Guid associationId, PaginationParams paginationParams, CancellationToken cancellationToken = default)
        {
            var query = Context.Follows
                .Where(f => f.AssociationId == associationId)
                .Include(f => f.Student)
                .Select(f => f.Student)
                .OrderBy(s => s.FirstName)
                .ThenBy(s => s.LastName);

            var totalCount = await query.CountAsync(cancellationToken);
            
            var items = await query
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedList<Student>(items, paginationParams.PageNumber, paginationParams.PageSize, totalCount);
        }

        public async Task<int> GetFollowersCountByAssociationIdAsync(Guid associationId, CancellationToken cancellationToken = default)
        {
            return await Context.Follows
                .CountAsync(f => f.AssociationId == associationId, cancellationToken);
        }

        public async Task<IEnumerable<Association>> GetFollowedAssociationsByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
        {
            return await Context.Follows
                .Where(f => f.StudentId == studentId)
                .Include(f => f.Association)
                .Select(f => f.Association)
                .OrderBy(a => a.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task<PagedList<Association>> GetFollowedAssociationsByStudentIdPagedAsync(Guid studentId, PaginationParams paginationParams, CancellationToken cancellationToken = default)
        {
            var query = Context.Follows
                .Where(f => f.StudentId == studentId)
                .Include(f => f.Association)
                .Select(f => f.Association)
                .OrderBy(a => a.Name);

            var totalCount = await query.CountAsync(cancellationToken);
            
            var items = await query
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedList<Association>(items, paginationParams.PageNumber, paginationParams.PageSize, totalCount);
        }

        public async Task<int> GetFollowedAssociationsCountByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
        {
            return await Context.Follows
                .CountAsync(f => f.StudentId == studentId, cancellationToken);
        }

        public async Task<IEnumerable<Follow>> GetFollowsByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
        {
            return await Context.Follows
                .Where(f => f.StudentId == studentId)
                .Include(f => f.Association)
                .ToListAsync(cancellationToken);
        }
    }
} 