using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Announcements.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementWithInteractions
{
    public class GetAnnouncementWithInteractionsQueryHandler : IQueryHandler<GetAnnouncementWithInteractionsQuery, AnnouncementWithInteractionsDto>
    {
        private readonly IAnnouncementRepository _announcementRepository;
        private readonly IAnnouncementLikeRepository _likeRepository;
        private readonly IAnnouncementCommentRepository _commentRepository;

        public GetAnnouncementWithInteractionsQueryHandler(
            IAnnouncementRepository announcementRepository,
            IAnnouncementLikeRepository likeRepository,
            IAnnouncementCommentRepository commentRepository)
        {
            _announcementRepository = announcementRepository;
            _likeRepository = likeRepository;
            _commentRepository = commentRepository;
        }

        public async Task<Maybe<AnnouncementWithInteractionsDto>> Handle(GetAnnouncementWithInteractionsQuery request, CancellationToken cancellationToken)
        {
            var announcement = await _announcementRepository.GetByIdAsync(request.AnnouncementId, cancellationToken);

            if (announcement == null)
            {
                return Maybe<AnnouncementWithInteractionsDto>.None;
            }

            // Get interaction counts
            var likeCount = await _likeRepository.GetLikeCountAsync(announcement.Id, cancellationToken);
            var commentCount = await _commentRepository.GetCommentCountAsync(announcement.Id, cancellationToken);

            // Check if user liked this announcement
            bool isLikedByUser = false;
            if (request.UserId.HasValue && request.UserType != null)
            {
                isLikedByUser = await _likeRepository.ExistsAsync(
                    announcement.Id,
                    request.UserId.Value,
                    request.UserType,
                    cancellationToken);
            }

            return new AnnouncementWithInteractionsDto(
                announcement.Id,
                announcement.AssociationId,
                announcement.EventId,
                announcement.Title,
                announcement.Content,
                announcement.ImageUrl,
                announcement.PublishedDate,
                announcement.Association?.Name ?? "Unknown Association",
                announcement.Event?.Title,
                announcement.CreatedAt,
                announcement.UpdatedAt,
                likeCount,
                commentCount,
                isLikedByUser
            );
        }
    }
} 
 
 