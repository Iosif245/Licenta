using System;
using System.Collections.Generic;

namespace ConnectCampus.Api.Models.Associations
{
    /// <summary>
    /// Request to create a new association
    /// </summary>
    public record CreateAssociationRequest(
        Guid UserId,
        string Name,
        string Slug,
        string Description,
        string Logo,
        string CoverImage,
        string Category,
        int FoundedYear,
        string Email,
        string? Location,
        string? Website,
        string? Phone,
        string? Address,
        string? Facebook,
        string? Twitter,
        string? Instagram,
        string? LinkedIn,
        List<string>? Tags
    );
} 