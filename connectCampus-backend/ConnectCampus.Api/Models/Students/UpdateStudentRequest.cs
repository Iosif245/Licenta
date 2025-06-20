using System;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Api.Models.Students
{
    /// <summary>
    /// Request to update an existing student
    /// </summary>
    public record UpdateStudentRequest(
        string FirstName,
        string LastName,
        string? Bio,
        string University,
        string Faculty,
        string Specialization,
        int StudyYear,
        string EducationLevel,
        string? LinkedInUrl,
        string? GitHubUrl,
        string? FacebookUrl,
        IFormFile? Avatar = null
    );
} 