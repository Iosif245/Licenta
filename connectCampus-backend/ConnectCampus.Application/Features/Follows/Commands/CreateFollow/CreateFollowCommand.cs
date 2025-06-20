using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Follows.Commands.CreateFollow
{
    public record CreateFollowCommand(
        Guid StudentId,
        Guid AssociationId
    ) : ICommand<bool>;
} 