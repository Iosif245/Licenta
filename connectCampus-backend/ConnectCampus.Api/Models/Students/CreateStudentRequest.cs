using System;

namespace ConnectCampus.Api.Models.Students
{
    /// <summary>
    /// Request to create a new student
    /// </summary>
    public record CreateStudentRequest(
        Guid UserId,
        string Email,
        string FirstName,
        string LastName,
        string University,
        string Faculty,
        string Specialization,
        int StudyYear,
        string EducationLevel
    );
} 