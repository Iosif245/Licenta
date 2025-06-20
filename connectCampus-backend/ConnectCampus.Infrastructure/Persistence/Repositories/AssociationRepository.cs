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
    public class AssociationRepository : Repository<Association>, IAssociationRepository
    {
        public AssociationRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<Association?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Associations
                .Include(a => a.AssociationEvents)
                .Include(a => a.Announcements)
                .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        }

        public async Task<Association?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            return await Context.Associations
                .Include(a => a.AssociationEvents)
                .Include(a => a.Announcements)
                .FirstOrDefaultAsync(a => a.Slug == slug, cancellationToken);
        }

        public async Task<Association?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await Context.Associations
                .FirstOrDefaultAsync(a => a.UserId == userId, cancellationToken);
        }

        public async Task<IEnumerable<Association>> ListAsync(CancellationToken cancellationToken = default)
        {
            return await Context.Associations
                .OrderBy(a => a.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task<PagedList<Association>> ListPagedAsync(PaginationParams paginationParams, CancellationToken cancellationToken = default)
        {
            var query = Context.Associations
                .OrderBy(a => a.Name)
                .AsQueryable();

            var totalCount = await query.CountAsync(cancellationToken);
            
            var items = await query
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedList<Association>(items, paginationParams.PageNumber, paginationParams.PageSize, totalCount);
        }

        public async Task<IEnumerable<Association>> ListByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
        {
            return await Context.Associations
                .Where(a => ids.Contains(a.Id))
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Association>> ListByCategoryAsync(string category, CancellationToken cancellationToken = default)
        {
            return await Context.Associations
                .Where(a => a.Category == category)
                .OrderBy(a => a.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task<PagedList<Association>> ListByCategoryPagedAsync(string category, PaginationParams paginationParams, CancellationToken cancellationToken = default)
        {
            var query = Context.Associations
                .Where(a => a.Category == category)
                .OrderBy(a => a.Name)
                .AsQueryable();

            var totalCount = await query.CountAsync(cancellationToken);
            
            var items = await query
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedList<Association>(items, paginationParams.PageNumber, paginationParams.PageSize, totalCount);
        }

        public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
        {
            return await Context.Associations
                .AnyAsync(a => a.Name == name, cancellationToken);
        }

        public async Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            return await Context.Associations
                .AnyAsync(a => a.Slug == slug, cancellationToken);
        }

        public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Associations
                .AnyAsync(a => a.Id == id, cancellationToken);
        }
    }
} 