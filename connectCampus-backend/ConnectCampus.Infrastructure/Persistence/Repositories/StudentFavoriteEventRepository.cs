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
    public class StudentFavoriteEventRepository : Repository<StudentFavoriteEvent>, IStudentFavoriteEventRepository
    {
        public StudentFavoriteEventRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<StudentFavoriteEvent?> GetByStudentAndEventAsync(Guid studentId, Guid eventId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentFavoriteEvents
                .Include(sfe => sfe.Student)
                .Include(sfe => sfe.Event)
                .FirstOrDefaultAsync(sfe => sfe.StudentId == studentId && sfe.EventId == eventId, cancellationToken);
        }

        public async Task<List<StudentFavoriteEvent>> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentFavoriteEvents
                .Include(sfe => sfe.Event)
                .ThenInclude(e => e.Association)
                .Where(sfe => sfe.StudentId == studentId)
                .OrderByDescending(sfe => sfe.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<StudentFavoriteEvent>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentFavoriteEvents
                .Include(sfe => sfe.Student)
                .Where(sfe => sfe.EventId == eventId)
                .OrderByDescending(sfe => sfe.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsByStudentAndEventAsync(Guid studentId, Guid eventId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentFavoriteEvents
                .AnyAsync(sfe => sfe.StudentId == studentId && sfe.EventId == eventId, cancellationToken);
        }

        public async Task<int> GetFavoriteCountByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentFavoriteEvents
                .CountAsync(sfe => sfe.EventId == eventId, cancellationToken);
        }

        public async Task<int> GetFavoriteCountByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
        {
            return await Context.StudentFavoriteEvents
                .CountAsync(sfe => sfe.StudentId == studentId, cancellationToken);
        }
    }
} 