using System;
using System.Collections.Generic;

namespace ConnectCampus.Application.Features.Associations.Dtos
{
    public record AssociationDto(
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
        string Email,
        string? Phone,
        string? Address,
        string? Facebook,
        string? Twitter,
        string? Instagram,
        string? LinkedIn,
        List<Guid> EventIds,
        List<Guid> AnnouncementIds,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
} 