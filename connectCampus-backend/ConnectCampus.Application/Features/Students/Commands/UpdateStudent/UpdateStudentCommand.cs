using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Students.Commands.UpdateStudent
{
    public record UpdateStudentCommand(
        Guid Id,
        string FirstName,
        string LastName,
        string? Bio,
        string University,
        string Faculty,
        string Specialization,
        int StudyYear,
        EducationLevel EducationLevel,
        string? LinkedInUrl,
        string? GitHubUrl,
        string? FacebookUrl,
        IFormFile? Avatar = null
    ) : ICommand<bool>;
} 