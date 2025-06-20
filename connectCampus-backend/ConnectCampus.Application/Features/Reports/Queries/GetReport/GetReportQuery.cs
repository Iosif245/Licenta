using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Reports.Dtos;

namespace ConnectCampus.Application.Features.Reports.Queries.GetReport
{
    public record GetReportQuery(Guid Id) : IQuery<ReportDto>;
} 