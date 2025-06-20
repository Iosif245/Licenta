using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class StudentRepository : Repository<Student>, IStudentRepository
    {
        public StudentRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Students
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        }

        public async Task<Student?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await Context.Students
                .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
        }

        public async Task<Student?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            return await Context.Students
                .FirstOrDefaultAsync(s => s.Email == email, cancellationToken);
        }

        public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            return await Context.Students
                .AnyAsync(s => s.Email == email, cancellationToken);
        }

        public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await Context.Students
                .AnyAsync(s => s.Id == id, cancellationToken);
        }

        public async Task<IEnumerable<Student>> ListAsync(CancellationToken cancellationToken = default)
        {
            return await Context.Students
                .ToListAsync(cancellationToken);
        }
    }
} 