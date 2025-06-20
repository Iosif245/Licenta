using System.Collections.Generic;
using ConnectCampus.Application.Common.Interfaces;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext Context;

        public Repository(ApplicationDbContext context)
        {
            Context = context;
        }

        public void Add(T entity)
        {
            Context.Set<T>().Add(entity);
        }

        public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            await Context.Set<T>().AddAsync(entity, cancellationToken);
        }

        public void AddRange(IEnumerable<T> entities)
        {
            Context.Set<T>().AddRange(entities);
        }

        public void Update(T entity)
        {
            Context.Set<T>().Update(entity);
        }

        public void Remove(T entity)
        {
            Context.Set<T>().Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            Context.Set<T>().RemoveRange(entities);
        }
    }
} 