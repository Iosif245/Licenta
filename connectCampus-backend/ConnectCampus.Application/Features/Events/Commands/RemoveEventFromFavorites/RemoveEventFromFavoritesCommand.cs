using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Events.Commands.RemoveEventFromFavorites
{
    public record RemoveEventFromFavoritesCommand(
        Guid StudentId,
        Guid EventId
    ) : ICommand<bool>;
} 