using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;

namespace ConnectCampus.Application.Features.Events.Queries.GetFeaturedEvents
{
    public record GetFeaturedEventsQuery(int Count = 5) : IQuery<List<EventSummaryDto>>;
} 