using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;

namespace ConnectCampus.Application.Features.Events.Queries.GetUpcomingEvents
{
    public record GetUpcomingEventsQuery(int Count = 10) : IQuery<List<EventSummaryDto>>;
} 