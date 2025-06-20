using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Events.Commands.UpdateEvent
{
    public record UpdateEventCommand(
        Guid Id,
        string Title,
        string Description,
        DateTime StartDate,
        DateTime EndDate,
        string Timezone,
        string Location,
        string Category,
        List<string>? Tags,
        int Capacity,
        bool IsPublic,
        bool IsFeatured,
        bool RegistrationRequired,
        DateTime? RegistrationDeadline,
        string? RegistrationUrl,
        decimal? Price,
        bool IsFree,
        string? PaymentMethod,
        string? ContactEmail,
        EventStatus Status,
        int? MaxAttendees,
        EventType Type,
        IFormFile? CoverImage = null
    ) : ICommand<bool>;
} 