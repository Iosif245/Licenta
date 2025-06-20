using System;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Api.Models.Announcements
{
    public class CreateAnnouncementRequest
    {
        /// <summary>
        /// The ID of the association making the announcement
        /// </summary>
        public Guid AssociationId { get; set; }
        
        /// <summary>
        /// The title of the announcement
        /// </summary>
        public string Title { get; set; } = string.Empty;
        
        /// <summary>
        /// The content of the announcement
        /// </summary>
        public string Content { get; set; } = string.Empty;
        
        /// <summary>
        /// Optional image file for the announcement
        /// </summary>
        public IFormFile? Image { get; set; }
        
        /// <summary>
        /// Optional ID of an event this announcement is related to
        /// </summary>
        public Guid? EventId { get; set; }
    }
} 