namespace ConnectCampus.Api.Models.Users
{
    public class UpdateUserPreferencesRequest
    {
        /// <summary>
        /// Whether two-factor authentication is enabled
        /// </summary>
        public bool IsTwoFactorEnabled { get; set; }
        
        /// <summary>
        /// Whether to receive event reminders
        /// </summary>
        public bool EventRemindersEnabled { get; set; } = true;
        
        /// <summary>
        /// Whether to receive notifications for new messages
        /// </summary>
        public bool MessageNotificationsEnabled { get; set; } = true;
        
        /// <summary>
        /// Whether to receive updates from followed associations
        /// </summary>
        public bool AssociationUpdatesEnabled { get; set; } = true;
        
        /// <summary>
        /// Whether to receive promotional emails and newsletters
        /// </summary>
        public bool MarketingEmailsEnabled { get; set; } = false;
        
        /// <summary>
        /// The preferred theme (System, Light, or Dark)
        /// </summary>
        public string Theme { get; set; } = "System";
    }
} 