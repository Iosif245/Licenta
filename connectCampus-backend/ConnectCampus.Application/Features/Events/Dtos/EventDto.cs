using System;
using System.Collections.Generic;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Events.Dtos
{
    public record EventDto(
        Guid Id,
        Guid AssociationId,
        string Title,
        string Slug,
        string Description,
        string CoverImageUrl,
        DateTime StartDate,
        DateTime EndDate,
        string Timezone,
        string Location,
        string Category,
        List<string> Tags,
        int Capacity,
        bool IsPublic,
        bool IsFeatured,
        bool RegistrationRequired,
        DateTime? RegistrationDeadline,
        string RegistrationUrl,
        decimal? Price,
        bool IsFree,
        string PaymentMethod,
        string ContactEmail,
        string Status,
        int AttendeesCount,
        int? MaxAttendees,
        string AssociationName,
        string AssociationLogo,
        List<string> Announcements,
        string Type,
        DateTime CreatedAt,
        DateTime? UpdatedAt
    );
} 