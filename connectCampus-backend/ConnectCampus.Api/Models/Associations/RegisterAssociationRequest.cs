using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Api.Models.Associations
{
    /// <summary>
    /// Request to register a new association account
    /// </summary>
    public record RegisterAssociationRequest(
        string Email,
        string Password,
        string Name,
        string Description,
        string Category,
        int FoundedYear,
        IFormFile Logo,
        IFormFile CoverImage,
        string? Location = null,
        string? Website = null,
        string? Phone = null,
        string? Address = null,
        string? Facebook = null,
        string? Twitter = null,
        string? Instagram = null,
        string? LinkedIn = null
    );
} 