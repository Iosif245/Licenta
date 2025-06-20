using System.Collections.Generic;

namespace ConnectCampus.Api.Models.Students
{
    /// <summary>
    /// Request to update a student's interests
    /// </summary>
    public record UpdateStudentInterestsRequest(List<string> Interests);
} 