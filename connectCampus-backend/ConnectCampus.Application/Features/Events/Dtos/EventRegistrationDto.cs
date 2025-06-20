using System;
using ConnectCampus.Application.Features.Events.Dtos;

namespace ConnectCampus.Application.Features.Events.Dtos
{
    public record EventRegistrationDto(
        Guid Id,
        Guid StudentId,
        Guid EventId,
        DateTime RegisteredAt,
        bool IsAttended,
        EventSummaryDto Event
    );
} 