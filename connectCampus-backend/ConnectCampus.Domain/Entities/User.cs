using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Domain.Entities
{
    public class User : Entity
    {
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public UserRole Role { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }
        
        // Two-factor authentication
        public bool IsTwoFactorEnabled { get; private set; }
        
        // Notification preferences
        public bool EventRemindersEnabled { get; private set; } = true;
        public bool MessageNotificationsEnabled { get; private set; } = true;
        public bool AssociationUpdatesEnabled { get; private set; } = true;
        public bool MarketingEmailsEnabled { get; private set; } = false;
        
        // Theme preference
        public Theme PreferredTheme { get; private set; } = Theme.System;
        
        private User() 
        {
        }

        public User(
            string email,
            string passwordHash,
            UserRole role,
            DateTime createdAt) : base(Guid.NewGuid())
        {
            Email = email;
            PasswordHash = passwordHash;
            Role = role;
            CreatedAt = createdAt;
            
            // Default values
            IsTwoFactorEnabled = false;
            EventRemindersEnabled = true;
            MessageNotificationsEnabled = true;
            AssociationUpdatesEnabled = true;
            MarketingEmailsEnabled = false;
            PreferredTheme = Theme.System;
        }

        public void UpdatePassword(string passwordHash, DateTime utcNow)
        {
            PasswordHash = passwordHash;
            UpdatedAt = utcNow;
        }
        
        public void UpdateEmail(string email, DateTime utcNow)
        {
            Email = email;
            UpdatedAt = utcNow;
        }
        
        public void SetTwoFactorEnabled(bool isEnabled, DateTime utcNow)
        {
            IsTwoFactorEnabled = isEnabled;
            UpdatedAt = utcNow;
        }
        
        public void UpdateNotificationPreferences(
            bool eventReminders, 
            bool messageNotifications,
            bool associationUpdates,
            bool marketingEmails,
            DateTime utcNow)
        {
            EventRemindersEnabled = eventReminders;
            MessageNotificationsEnabled = messageNotifications;
            AssociationUpdatesEnabled = associationUpdates;
            MarketingEmailsEnabled = marketingEmails;
            UpdatedAt = utcNow;
        }
        
        public void UpdateTheme(Theme theme, DateTime utcNow)
        {
            PreferredTheme = theme;
            UpdatedAt = utcNow;
        }
    }
} 