using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Students.Commands.DeleteStudent
{
    public record DeleteStudentCommand(Guid Id) : ICommand<bool>;
} 