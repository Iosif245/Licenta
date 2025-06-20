using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Associations.Commands.CreateAssociation
{
    public record CreateAssociationCommand(
        Guid UserId,
        string Name,
        string Slug,
        string Description,
        string Logo,
        string CoverImage,
        string Category,
        int FoundedYear,
        string Email,
        string? Location = null,
        string? Website = null,
        string? Phone = null,
        string? Address = null,
        string? Facebook = null,
        string? Twitter = null,
        string? Instagram = null,
        string? LinkedIn = null,
        List<string>? Tags = null
    ) : ICommand<Guid>;
} 