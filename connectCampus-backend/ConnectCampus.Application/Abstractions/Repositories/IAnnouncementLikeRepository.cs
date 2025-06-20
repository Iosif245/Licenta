using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Abstractions.Repositories
{
    public interface IAnnouncementLikeRepository : IRepository<AnnouncementLike>
    {
        Task<AnnouncementLike?> GetByAnnouncementAndAuthorAsync(
            Guid announcementId, 
            Guid authorId, 
            AuthorType authorType, 
            CancellationToken cancellationToken = default);
        
        Task<bool> ExistsAsync(
            Guid announcementId, 
            Guid authorId, 
            AuthorType authorType, 
            CancellationToken cancellationToken = default);
        
        Task<int> GetLikeCountAsync(
            Guid announcementId, 
            CancellationToken cancellationToken = default);

        Task<List<AnnouncementLike>> GetLikesByAnnouncementAsync(
            Guid announcementId, 
            CancellationToken cancellationToken = default);
    }
} 