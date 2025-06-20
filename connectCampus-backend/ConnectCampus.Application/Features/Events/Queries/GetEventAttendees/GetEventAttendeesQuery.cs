using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;

namespace ConnectCampus.Application.Features.Events.Queries.GetEventAttendees;

public record GetEventAttendeesQuery(Guid EventId) : IQuery<List<EventAttendeeDto>>; 