using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Associations.Commands.UpdateAssociation
{
    public record UpdateAssociationCommand(
        Guid Id,
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
    ) : ICommand<bool>;
} 