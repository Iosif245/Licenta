using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Reports.Commands.DeleteReport
{
    public record DeleteReportCommand(Guid Id) : ICommand<bool>;
} 