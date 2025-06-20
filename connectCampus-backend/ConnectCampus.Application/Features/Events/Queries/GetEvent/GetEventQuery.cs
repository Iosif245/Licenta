using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;

namespace ConnectCampus.Application.Features.Events.Queries.GetEvent
{
    public record GetEventQuery(Guid Id) : IQuery<EventDto>;
} 