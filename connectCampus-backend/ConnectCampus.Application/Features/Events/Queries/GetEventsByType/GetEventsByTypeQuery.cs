using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Events.Queries.GetEventsByType
{
    public record GetEventsByTypeQuery(EventType Type) : IQuery<List<EventSummaryDto>>;
} 