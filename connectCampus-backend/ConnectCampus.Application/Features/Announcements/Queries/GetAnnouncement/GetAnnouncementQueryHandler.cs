using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Announcements.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncement
{
    public class GetAnnouncementQueryHandler : IQueryHandler<GetAnnouncementQuery, AnnouncementDto>
    {
        private readonly IAnnouncementRepository _announcementRepository;

        public GetAnnouncementQueryHandler(IAnnouncementRepository announcementRepository)
        {
            _announcementRepository = announcementRepository;
        }

        public async Task<Maybe<AnnouncementDto>> Handle(GetAnnouncementQuery request, CancellationToken cancellationToken)
        {
            var announcement = await _announcementRepository.GetByIdAsync(request.Id, cancellationToken);

            if (announcement == null)
            {
                return Maybe<AnnouncementDto>.None;
            }

            return new AnnouncementDto(
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
                announcement.UpdatedAt
            );
        }
    }
} 