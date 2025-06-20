using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Follows.Commands.DeleteFollow
{
    public record DeleteFollowCommand(
        Guid StudentId,
        Guid AssociationId
    ) : ICommand<bool>;
} 