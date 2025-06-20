using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Events.Commands.UnregisterFromEvent
{
    public record UnregisterFromEventCommand(
        Guid StudentId,
        Guid EventId
    ) : ICommand<bool>;
} 