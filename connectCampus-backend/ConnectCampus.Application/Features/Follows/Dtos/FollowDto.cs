using System;

namespace ConnectCampus.Application.Features.Follows.Dtos
{
    public record FollowDto(
        int Id,
        Guid StudentId,
        string StudentFirstName,
        string StudentLastName,
        string? StudentAvatarUrl,
        DateTime CreatedAt
    );
} 