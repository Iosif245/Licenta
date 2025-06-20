using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Events.Commands.RegisterForEvent
{
    public record RegisterForEventCommand(
        Guid StudentId,
        Guid EventId
    ) : ICommand<Guid>;
} 