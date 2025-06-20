namespace ConnectCampus.Api.Models.Announcements
{
    public class UpdateAnnouncementRequest
    {
        /// <summary>
        /// The title of the announcement
        /// </summary>
        public string Title { get; set; } = string.Empty;
        
        /// <summary>
        /// The content of the announcement
        /// </summary>
        public string Content { get; set; } = string.Empty;
        
        /// <summary>
        /// Optional an image for the announcement
        /// </summary>
        public IFormFile? Image { get; set; }
    }
} 