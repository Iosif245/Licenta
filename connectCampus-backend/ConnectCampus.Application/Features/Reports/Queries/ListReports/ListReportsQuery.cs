using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Reports.Dtos;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Reports.Queries.ListReports
{
    public record ListReportsQuery(
        int Page = 1,
        int PageSize = 10,
        Guid? UserId = null,
        ReportStatus? Status = null,
        Guid? TargetId = null,
        string TargetType = null) : IQuery<List<ReportDto>>;
} 