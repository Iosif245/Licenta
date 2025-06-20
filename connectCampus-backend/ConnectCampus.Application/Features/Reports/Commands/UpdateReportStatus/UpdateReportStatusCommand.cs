using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Reports.Commands.UpdateReportStatus
{
    public record UpdateReportStatusCommand(
        Guid Id,
        ReportStatus Status) : ICommand<bool>;
} 