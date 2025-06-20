using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IStudentEventRegistrationRepository : IRepository<StudentEventRegistration>
    {
        Task<StudentEventRegistration?> GetByStudentAndEventAsync(Guid studentId, Guid eventId, CancellationToken cancellationToken = default);
        Task<List<StudentEventRegistration>> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
        Task<List<StudentEventRegistration>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<bool> ExistsByStudentAndEventAsync(Guid studentId, Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetRegistrationCountByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetRegistrationCountByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
    }
} 