using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Students.Commands.RegisterStudent
{
    public record RegisterStudentCommand(
        string Email,
        string Password,
        string FirstName,
        string LastName,
        string University,
        string Faculty,
        string Specialization,
        int StudyYear,
        EducationLevel EducationLevel,
        IFormFile Avatar
    ) : ICommand<Guid>;
} 