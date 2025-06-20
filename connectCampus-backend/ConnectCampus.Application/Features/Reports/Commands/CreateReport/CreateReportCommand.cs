using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Reports.Commands.CreateReport
{
    public record CreateReportCommand(
        Guid UserId,
        string Reason,
        string Description,
        Guid? TargetId,
        string TargetType) : ICommand<Guid>;
} 