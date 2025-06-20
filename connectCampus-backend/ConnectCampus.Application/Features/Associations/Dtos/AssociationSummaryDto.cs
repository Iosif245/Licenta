using System;
using System.Collections.Generic;

namespace ConnectCampus.Application.Features.Associations.Dtos
{
    public record AssociationSummaryDto(
        Guid Id,
        string Name,
        string Slug,
        string Description,
        string Logo,
        string CoverImage,
        string Category,
        int FoundedYear,
        bool IsVerified,
        int Events,
        int? UpcomingEventsCount,
        int? Followers,
        string? Location,
        string? Website,
        List<string> Tags,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
} 