using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Events.Commands.AddEventToFavorites
{
    public record AddEventToFavoritesCommand(
        Guid StudentId,
        Guid EventId
    ) : ICommand<Guid>;
} 