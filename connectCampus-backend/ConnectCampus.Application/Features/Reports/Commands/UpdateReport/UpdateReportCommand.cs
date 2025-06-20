using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Reports.Commands.UpdateReport
{
    public record UpdateReportCommand(
        Guid Id,
        string Reason,
        string Description) : ICommand<bool>;
} 