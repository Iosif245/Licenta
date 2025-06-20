using ConnectCampus.Application.Abstractions.Messaging;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Associations.Commands.RegisterAssociation
{
    public record RegisterAssociationCommand(
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
    ) : ICommand<Guid>;
} 