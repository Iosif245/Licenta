using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Students.Commands.UpdateStudentInterests
{
    public record UpdateStudentInterestsCommand(
        Guid Id,
        List<string> Interests
    ) : ICommand<bool>;
} 