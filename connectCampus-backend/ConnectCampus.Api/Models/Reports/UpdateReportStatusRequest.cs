using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Api.Models.Reports
{
    public class UpdateReportStatusRequest
    {
        /// <summary>
        /// The new status for the report
        /// </summary>
        public ReportStatus Status { get; set; }
    }
} 