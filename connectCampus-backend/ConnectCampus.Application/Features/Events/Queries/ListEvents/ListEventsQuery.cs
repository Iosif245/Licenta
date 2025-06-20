using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Events.Queries.ListEvents
{
    public record ListEventsQuery(
        int Page = 1,
        int PageSize = 10,
        bool? Featured = null,
        bool UpcomingOnly = true,
        string? Category = null,
        EventType? Type = null
    ) : IQuery<List<EventSummaryDto>>;
} 