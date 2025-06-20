using System;

namespace ConnectCampus.Api.Models.Reports
{
    public class UpdateReportRequest
    {
        /// <summary>
        /// The reason for the report (e.g., "Inappropriate content", "Spam", etc.)
        /// </summary>
        public string Reason { get; set; } = string.Empty;
        
        /// <summary>
        /// Detailed description of the report
        /// </summary>
        public string Description { get; set; } = string.Empty;
    }
} 