using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Events.Commands.DeleteEvent
{
    public record DeleteEventCommand(Guid Id) : ICommand<bool>;
} 