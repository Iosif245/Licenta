using System;
using System.Collections.Generic;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Students;

public record StudentDto(
    Guid Id,
    Guid UserId,
    string Email,
    DateTime JoinedDate,
    string FirstName,
    string LastName,
    string? Bio,
    string? AvatarUrl,
    string University,
    string Faculty,
    string Specialization,
    int StudyYear,
    EducationLevel EducationLevel,
    string? LinkedInUrl,
    string? GitHubUrl,
    string? FacebookUrl,
    IEnumerable<string> Interests,
    IEnumerable<Guid> FavoriteEventIds,
    IEnumerable<Guid> RegisteredEventIds,
    DateTime CreatedAt,
    DateTime UpdatedAt); 