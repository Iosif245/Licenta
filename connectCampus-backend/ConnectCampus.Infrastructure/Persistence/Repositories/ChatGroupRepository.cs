using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Infrastructure.Persistence.Repositories;

public class ChatGroupRepository : Repository<ChatGroup>, IChatGroupRepository
{
    public ChatGroupRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ChatGroup?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Context.Set<ChatGroup>()
            .Include(cg => cg.Messages)
            .FirstOrDefaultAsync(cg => cg.Id == id, cancellationToken);
    }

    public async Task<ChatGroup?> GetByParticipantsAsync(Guid studentId, Guid associationId, CancellationToken cancellationToken = default)
    {
        return await Context.Set<ChatGroup>()
            .Include(cg => cg.Messages)
            .FirstOrDefaultAsync(cg => cg.StudentId == studentId && cg.AssociationId == associationId, cancellationToken);
    }

    public async Task<List<ChatGroup>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await Context.Set<ChatGroup>()
            .Include(cg => cg.Messages)
            .Where(cg => cg.StudentId == userId || cg.AssociationId == userId)
            .OrderByDescending(cg => cg.LastMessageAt ?? cg.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Context.Set<ChatGroup>()
            .AnyAsync(cg => cg.Id == id, cancellationToken);
    }
} 