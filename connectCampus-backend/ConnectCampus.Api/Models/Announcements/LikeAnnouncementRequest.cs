using System;

namespace ConnectCampus.Api.Models.Announcements
{
    public class LikeAnnouncementRequest
    {
        /// <summary>
        /// ID of the author (Student or Association)
        /// </summary>
        public Guid AuthorId { get; set; }
        
        /// <summary>
        /// Type of author ("Student" or "Association")
        /// </summary>
        public string AuthorType { get; set; } = string.Empty;
    }
} 