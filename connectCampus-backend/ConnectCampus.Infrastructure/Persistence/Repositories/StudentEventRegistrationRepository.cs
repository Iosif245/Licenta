using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Infrastructure.Persistence.Repositories
{
    public class StudentEventRegistrationRepository : Repository<StudentEventRegistration>, IStudentEventRegistrationRepository
    {
        public StudentEventRegistrationRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<StudentEventRegistration?> GetByStudentAndEventAsync(Guid studentId, Guid eventId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentEventRegistrations
                .Include(ser => ser.Student)
                .Include(ser => ser.Event)
                .FirstOrDefaultAsync(ser => ser.StudentId == studentId && ser.EventId == eventId, cancellationToken);
        }

        public async Task<List<StudentEventRegistration>> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentEventRegistrations
                .Include(ser => ser.Event)
                .ThenInclude(e => e.Association)
                .Where(ser => ser.StudentId == studentId)
                .OrderByDescending(ser => ser.RegisteredAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<StudentEventRegistration>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentEventRegistrations
                .Include(ser => ser.Student)
                    .ThenInclude(s => s.User)
                .Where(ser => ser.EventId == eventId)
                .OrderByDescending(ser => ser.RegisteredAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsByStudentAndEventAsync(Guid studentId, Guid eventId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentEventRegistrations
                .AnyAsync(ser => ser.StudentId == studentId && ser.EventId == eventId, cancellationToken);
        }

        public async Task<int> GetRegistrationCountByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentEventRegistrations
                .CountAsync(ser => ser.EventId == eventId, cancellationToken);
        }

        public async Task<int> GetRegistrationCountByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentEventRegistrations
                .CountAsync(ser => ser.StudentId == studentId, cancellationToken);
        }
    }
} 