using System;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Reports.Dtos
{
    public record ReportDto(
        Guid Id,
        Guid UserId,
        string Reason,
        string Description,
        ReportStatus Status,
        DateTime CreatedAt,
        DateTime? UpdatedAt,
        Guid? TargetId,
        string TargetType
    );
} 