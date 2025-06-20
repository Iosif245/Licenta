using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Api.Models.Associations
{
    /// <summary>
    /// Request to update an existing association
    /// </summary>
    public record UpdateAssociationRequest(
        string Name,
        string Slug,
        string Description,
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
        List<string>? Tags,
        IFormFile? Logo = null,
        IFormFile? CoverImage = null
    );
} 