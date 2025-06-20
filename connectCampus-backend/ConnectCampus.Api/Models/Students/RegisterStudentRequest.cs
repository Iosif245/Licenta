using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Api.Models.Students
{
    /// <summary>
    /// Request to register a new student account
    /// </summary>
    public record RegisterStudentRequest(
        string Email,
        string Password,
        string FirstName,
        string LastName,
        string University,
        string Faculty,
        string Specialization,
        int StudyYear,
        string EducationLevel,
        IFormFile Avatar
    );
} 