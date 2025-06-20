using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Events.Queries.GetAllEvents;

public record GetAllEventsQuery(
    bool? Featured = null,
    string? Category = null,
    EventType? Type = null,
    string? Search = null,
    string? Location = null
) : IQuery<List<EventSummaryDto>>; 