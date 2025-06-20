using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IStudentRepository : IRepository<Student>
    {
        Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Student?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<Student?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
        Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
        Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Student>> ListAsync(CancellationToken cancellationToken = default);
    }
} 