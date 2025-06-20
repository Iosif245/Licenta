using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IAnnouncementCommentRepository : IRepository<AnnouncementComment>
    {
        Task<AnnouncementComment?> GetByIdAsync(
            Guid id, 
            CancellationToken cancellationToken = default);
        
        Task<List<AnnouncementComment>> GetByAnnouncementIdAsync(
            Guid announcementId, 
            CancellationToken cancellationToken = default);
        
        Task<List<AnnouncementComment>> GetRepliesByParentIdAsync(
            Guid parentCommentId, 
            CancellationToken cancellationToken = default);
        
        Task<int> GetCommentCountAsync(
            Guid announcementId, 
            CancellationToken cancellationToken = default);
    }
} 