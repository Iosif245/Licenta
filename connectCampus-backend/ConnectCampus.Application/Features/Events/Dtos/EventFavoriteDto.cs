using System;
using ConnectCampus.Application.Features.Events.Dtos;

namespace ConnectCampus.Application.Features.Events.Dtos
{
    public record EventFavoriteDto(
        Guid Id,
        Guid StudentId,
        Guid EventId,
        DateTime CreatedAt,
        EventSummaryDto Event
    );
} 