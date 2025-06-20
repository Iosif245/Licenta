using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Abstractions.Repositories;

public interface IDbContext
{
    DbSet<TEntity> Set<TEntity>()
        where TEntity : class;

}