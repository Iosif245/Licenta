using System;

namespace ConnectCampus.Api.Models.Reports
{
    public class CreateReportRequest
    {
        /// <summary>
        /// The ID of the user submitting the report
        /// </summary>
        public Guid UserId { get; set; }
        
        /// <summary>
        /// The reason for the report (e.g., "Inappropriate content", "Spam", etc.)
        /// </summary>
        public string Reason { get; set; } = string.Empty;
        
        /// <summary>
        /// Detailed description of the report
        /// </summary>
        public string Description { get; set; } = string.Empty;
        
        /// <summary>
        /// The ID of the target entity being reported (optional)
        /// </summary>
        public Guid? TargetId { get; set; }
        
        /// <summary>
        /// The type of entity being reported (e.g., "Event", "Announcement", etc.)
        /// </summary>
        public string TargetType { get; set; } = string.Empty;
    }
} 