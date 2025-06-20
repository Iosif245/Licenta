using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Students.Commands.CreateStudent
{
    public record CreateStudentCommand(
        Guid UserId,
        string Email,
        string FirstName,
        string LastName,
        string University,
        string Faculty,
        string Specialization,
        int StudyYear,
        EducationLevel EducationLevel
    ) : ICommand<Guid>;
} 