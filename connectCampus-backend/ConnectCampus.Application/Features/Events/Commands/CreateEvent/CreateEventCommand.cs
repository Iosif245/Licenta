using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Events.Commands.CreateEvent
{
    public record CreateEventCommand(
        Guid AssociationId,
        string Title,
        string Description,
        IFormFile? CoverImage,
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
        EventType Type
    ) : ICommand<Guid>;
} 