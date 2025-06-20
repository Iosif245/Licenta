using System;
using System.Collections.Generic;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Events.Dtos
{
    public record EventSummaryDto(
        Guid Id,
        string Title,
        string Slug,
        string Description,
        string CoverImageUrl,
        DateTime StartDate,
        DateTime EndDate,
        string Location,
        string Category,
        List<string> Tags,
        bool IsFeatured,
        decimal? Price,
        bool IsFree,
        string Status,
        int AttendeesCount,
        string AssociationName,
        string AssociationLogo,
        string Type,
        Guid AssociationId
    );
} 