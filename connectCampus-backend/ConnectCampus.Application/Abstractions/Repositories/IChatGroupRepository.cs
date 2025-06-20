using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories;

public interface IChatGroupRepository : IRepository<ChatGroup>
{
    Task<ChatGroup?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ChatGroup?> GetByParticipantsAsync(Guid studentId, Guid associationId, CancellationToken cancellationToken = default);
    Task<List<ChatGroup>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default);
} 