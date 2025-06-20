using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;

namespace ConnectCampus.Application.Features.Events.Queries.GetEventsByCategory
{
    public record GetEventsByCategoryQuery(string Category) : IQuery<List<EventSummaryDto>>;
} 