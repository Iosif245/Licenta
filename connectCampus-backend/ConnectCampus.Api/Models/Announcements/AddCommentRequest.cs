using System;

namespace ConnectCampus.Api.Models.Announcements
{
    public class AddCommentRequest
    {
        /// <summary>
        /// ID of the author (Student or Association)
        /// </summary>
        public Guid AuthorId { get; set; }
        
        /// <summary>
        /// Type of author ("Student" or "Association")
        /// </summary>
        public string AuthorType { get; set; } = string.Empty;
        
        /// <summary>
        /// Content of the comment
        /// </summary>
        public string Content { get; set; } = string.Empty;
        
        /// <summary>
        /// Optional parent comment ID for replies
        /// </summary>
        public Guid? ParentCommentId { get; set; }
    }
} 