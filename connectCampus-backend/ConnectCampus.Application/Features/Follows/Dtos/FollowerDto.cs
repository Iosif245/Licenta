using System;

namespace ConnectCampus.Application.Features.Follows.Dtos
{
    public record FollowerDto(
        Guid Id,
        string FirstName,
        string LastName,
        string Email,
        string? ProfilePictureUrl,
        string University,
        string Faculty,
        string Specialization,
        int StudyYear,
        string EducationLevel
    );
} 