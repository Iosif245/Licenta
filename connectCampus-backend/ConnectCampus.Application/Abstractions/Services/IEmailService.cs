using System.Threading.Tasks;

namespace ConnectCampus.Application.Abstractions.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
        Task SendPasswordResetEmailAsync(string to, string resetToken);
        Task SendTwoFactorCodeAsync(string to, string code);
        Task SendWelcomeEmailAsync(string to, string username);
        Task SendEmailVerificationAsync(string to, string verificationToken);
        Task SendPasswordChangedNotificationAsync(string to, string username);
        Task SendAccountLockedNotificationAsync(string to, string username);
        Task SendEventRegistrationConfirmationAsync(string to, string eventTitle, string eventDate);
        Task SendEventReminderAsync(string to, string eventTitle, string eventDate);
        Task SendAnnouncementNotificationAsync(string to, string announcementTitle, string associationName);
    }
} 