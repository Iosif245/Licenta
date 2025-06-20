using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Queries.GetEvent
{
    public class GetEventBySlugQueryHandler : IQueryHandler<GetEventBySlugQuery, EventDto>
    {
        private readonly IEventRepository _eventRepository;

        public GetEventBySlugQueryHandler(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<Maybe<EventDto>> Handle(GetEventBySlugQuery request, CancellationToken cancellationToken)
        {
            var evnt = await _eventRepository.GetBySlugAsync(request.Slug, cancellationToken);

            if (evnt == null)
            {
                return Maybe<EventDto>.None;
            }

            var eventDto = new EventDto(
                evnt.Id,
                evnt.AssociationId,
                evnt.Title,
                evnt.Slug,
                evnt.Description,
                evnt.CoverImageUrl,
                evnt.StartDate,
                evnt.EndDate,
                evnt.Timezone,
                evnt.Location,
                evnt.Category,
                evnt.Tags,
                evnt.Capacity,
                evnt.IsPublic,
                evnt.IsFeatured,
                evnt.RegistrationRequired,
                evnt.RegistrationDeadline,
                evnt.RegistrationUrl,
                evnt.Price,
                evnt.IsFree,
                evnt.PaymentMethod,
                evnt.ContactEmail,
                evnt.Status.ToString(),
                evnt.AttendeesCount,
                evnt.MaxAttendees,
                evnt.AssociationName,
                evnt.AssociationLogo,
                evnt.Announcements,
                evnt.Type.ToString(),
                evnt.CreatedAt,
                evnt.UpdatedAt
            );

            return eventDto;
        }
    }
} 