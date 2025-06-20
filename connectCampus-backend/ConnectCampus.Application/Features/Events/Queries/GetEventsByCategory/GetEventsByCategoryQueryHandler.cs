using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Queries.GetEventsByCategory
{
    public class GetEventsByCategoryQueryHandler : IQueryHandler<GetEventsByCategoryQuery, List<EventSummaryDto>>
    {
        private readonly IEventRepository _eventRepository;

        public GetEventsByCategoryQueryHandler(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<Maybe<List<EventSummaryDto>>> Handle(GetEventsByCategoryQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Category))
            {
                return new List<EventSummaryDto>();
            }
            
            var events = await _eventRepository.GetByCategoryAsync(request.Category, cancellationToken);
            
            var eventDtos = events.Select(e => new EventSummaryDto(
                e.Id,
                e.Title,
                e.Slug,
                e.Description,
                e.CoverImageUrl,
                e.StartDate,
                e.EndDate,
                e.Location,
                e.Category,
                e.Tags,
                e.IsFeatured,
                e.Price,
                e.IsFree,
                e.Status.ToString(),
                e.AttendeesCount,
                e.AssociationName,
                e.AssociationLogo,
                e.Type.ToString(),
                e.AssociationId
            )).ToList();
            
            return eventDtos;
        }
    }
} 