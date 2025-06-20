namespace ConnectCampus.Application.Common.Interfaces
{
    public interface IRepository<T> where T : class
    {
        void Add(T entity);
        Task AddAsync(T entity, CancellationToken cancellationToken = default);
        void AddRange(IEnumerable<T> entities);
        void Update(T entity);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
    }
} 