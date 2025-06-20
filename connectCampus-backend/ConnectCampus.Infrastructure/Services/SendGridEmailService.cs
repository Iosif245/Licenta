using System;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace ConnectCampus.Infrastructure.Services
{
    public class SendGridEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SendGridEmailService> _logger;
        private readonly EmailTemplateService _templateService;
        private readonly string _apiKey;
        private readonly string _fromEmail;
        private readonly string _fromName;
        
        public SendGridEmailService(
            IConfiguration configuration,
            ILogger<SendGridEmailService> logger,
            EmailTemplateService templateService)
        {
            _configuration = configuration;
            _logger = logger;
            _templateService = templateService;
            _apiKey = _configuration["SendGrid:ApiKey"] ?? throw new ArgumentNullException("SendGrid:ApiKey");
            _fromEmail = _configuration["SendGrid:FromEmail"] ?? throw new ArgumentNullException("SendGrid:FromEmail");
            _fromName = _configuration["SendGrid:FromName"] ?? "ConnectCampus";
        }
        
        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress(_fromEmail, _fromName);
            var toAddress = new EmailAddress(to);
            var msg = MailHelper.CreateSingleEmail(from, toAddress, subject, isHtml ? null : body, isHtml ? body : null);
            
            try
            {
                var response = await client.SendEmailAsync(msg);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Failed to send email. Status code: {StatusCode}", response.StatusCode);
                }
                else
                {
                    _logger.LogInformation("Email sent successfully to {EmailAddress}", to);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to {EmailAddress}", to);
                throw;
            }
        }
        
        public async Task SendPasswordResetEmailAsync(string to, string resetToken)
        {
            var subject = "Reset Your Password - CampusConnect";
            var body = _templateService.GetPasswordResetEmailTemplate(resetToken);
            
            await SendEmailAsync(to, subject, body);
        }
        
        public async Task SendTwoFactorCodeAsync(string to, string code)
        {
            var subject = "Your Two-Factor Authentication Code - CampusConnect";
            var body = $@"
                <!DOCTYPE html>
                <html lang=""en"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>Two-Factor Authentication Code</title>
                    <style>
                        body {{
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f8fafc;
                        }}
                        .container {{
                            background: white;
                            border-radius: 12px;
                            padding: 40px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }}
                        .code {{
                            font-size: 36px;
                            font-weight: bold;
                            color: #06b6d4;
                            background: #f0f9ff;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                            letter-spacing: 8px;
                            font-family: 'Monaco', 'Menlo', monospace;
                        }}
                        .warning {{
                            background-color: #fef3cd;
                            border: 1px solid #fbbf24;
                            border-radius: 8px;
                            padding: 16px;
                            margin: 20px 0;
                            color: #92400e;
                        }}
                    </style>
                </head>
                <body>
                    <div class=""container"">
                        <h1>🔐 Two-Factor Authentication</h1>
                        <p>Your verification code is:</p>
                        <div class=""code"">{code}</div>
                        <div class=""warning"">
                            <strong>⏱️ This code will expire in 10 minutes</strong>
                        </div>
                        <p>If you didn't request this code, please ignore this email and secure your account.</p>
                    </div>
                </body>
                </html>";
            
            await SendEmailAsync(to, subject, body);
        }
        
        public async Task SendWelcomeEmailAsync(string to, string username)
        {
            var subject = "Welcome to CampusConnect! 🎉";
            var body = _templateService.GetWelcomeEmailTemplate(username);
            
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendEmailVerificationAsync(string to, string verificationToken)
        {
            var subject = "Verify Your Email Address - CampusConnect";
            var body = _templateService.GetEmailVerificationTemplate(verificationToken);
            
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendPasswordChangedNotificationAsync(string to, string username)
        {
            var subject = "Password Changed Successfully - CampusConnect";
            var body = $@"
                <!DOCTYPE html>
                <html lang=""en"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>Password Changed</title>
                    <style>
                        body {{
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f8fafc;
                        }}
                        .container {{
                            background: white;
                            border-radius: 12px;
                            padding: 40px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }}
                        .success-icon {{
                            text-align: center;
                            font-size: 48px;
                            margin: 20px 0;
                        }}
                        .security-warning {{
                            background-color: #fef2f2;
                            border: 1px solid #f87171;
                            border-radius: 8px;
                            padding: 16px;
                            margin: 20px 0;
                            color: #dc2626;
                        }}
                        .contact-info {{
                            background-color: #f0f9ff;
                            border: 1px solid #06b6d4;
                            border-radius: 8px;
                            padding: 16px;
                            margin: 20px 0;
                        }}
                    </style>
                </head>
                <body>
                    <div class=""container"">
                        <div class=""success-icon"">✅</div>
                        <h1>Password Changed Successfully</h1>
                        <p>Hello {username},</p>
                        <p>Your password has been successfully changed on your CampusConnect account.</p>
                        
                        <div class=""security-warning"">
                            <h3>🔒 Security Alert</h3>
                            <p><strong>If you didn't make this change:</strong><br>
                            Please contact our support team immediately as your account may be compromised.</p>
                        </div>
                        
                        <div class=""contact-info"">
                            <h3>Need Help?</h3>
                            <p>Contact us at: <a href=""mailto:support@campusconnect.com"">support@campusconnect.com</a></p>
                        </div>
                        
                        <p>Best regards,<br>The CampusConnect Team</p>
                    </div>
                </body>
                </html>";
            
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendAccountLockedNotificationAsync(string to, string username)
        {
            var subject = "Account Security Alert - CampusConnect";
            var body = $@"
                <!DOCTYPE html>
                <html lang=""en"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>Account Security Alert</title>
                    <style>
                        body {{
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f8fafc;
                        }}
                        .container {{
                            background: white;
                            border-radius: 12px;
                            padding: 40px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }}
                        .alert-icon {{
                            text-align: center;
                            font-size: 48px;
                            margin: 20px 0;
                        }}
                        .security-info {{
                            background-color: #fef3cd;
                            border: 1px solid #fbbf24;
                            border-radius: 8px;
                            padding: 16px;
                            margin: 20px 0;
                            color: #92400e;
                        }}
                        .next-steps {{
                            background-color: #f0f9ff;
                            border: 1px solid #06b6d4;
                            border-radius: 8px;
                            padding: 16px;
                            margin: 20px 0;
                        }}
                    </style>
                </head>
                <body>
                    <div class=""container"">
                        <div class=""alert-icon"">🔒</div>
                        <h1>Account Temporarily Locked</h1>
                        <p>Hello {username},</p>
                        <p>Your CampusConnect account has been temporarily locked due to multiple failed login attempts.</p>
                        
                        <div class=""security-info"">
                            <h3>🛡️ Security Measure</h3>
                            <p>This is an automatic security measure to protect your account from unauthorized access attempts.</p>
                        </div>
                        
                        <div class=""next-steps"">
                            <h3>What can you do?</h3>
                            <ul>
                                <li>Wait 30 minutes before trying to log in again</li>
                                <li>Reset your password if you've forgotten it</li>
                                <li>Contact support if you believe this is an error</li>
                            </ul>
                        </div>
                        
                        <p>If you believe this is an error or have concerns about your account security, please contact our support team.</p>
                        <p>Best regards,<br>The CampusConnect Team</p>
                    </div>
                </body>
                </html>";
            
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendEventRegistrationConfirmationAsync(string to, string eventTitle, string eventDate)
        {
            var subject = $"Registration Confirmed: {eventTitle} - CampusConnect";
            var body = $@"
                <!DOCTYPE html>
                <html lang=""en"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>Event Registration Confirmed</title>
                    <style>
                        body {{
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f8fafc;
                        }}
                        .container {{
                            background: white;
                            border-radius: 12px;
                            padding: 40px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }}
                        .success-icon {{
                            text-align: center;
                            font-size: 48px;
                            margin: 20px 0;
                        }}
                        .event-details {{
                            background: linear-gradient(135deg, #06b6d4, #14b8a6);
                            color: white;
                            padding: 24px;
                            border-radius: 8px;
                            margin: 20px 0;
                            text-align: center;
                        }}
                        .event-details h2 {{
                            margin: 0 0 10px;
                            font-size: 24px;
                        }}
                        .reminder {{
                            background-color: #dcfdf7;
                            border: 1px solid #10b981;
                            border-radius: 8px;
                            padding: 16px;
                            margin: 20px 0;
                            color: #047857;
                        }}
                    </style>
                </head>
                <body>
                    <div class=""container"">
                        <div class=""success-icon"">🎉</div>
                        <h1>Registration Confirmed!</h1>
                        <p>Great news! You have successfully registered for the following event:</p>
                        
                        <div class=""event-details"">
                            <h2>{eventTitle}</h2>
                            <p><strong>📅 Date:</strong> {eventDate}</p>
                        </div>
                        
                        <div class=""reminder"">
                            <h3>📱 Don't forget!</h3>
                            <p>Add this event to your calendar and we'll send you a reminder closer to the date.</p>
                        </div>
                        
                        <p>We're excited to see you there! If you have any questions about the event, please don't hesitate to reach out.</p>
                        <p>Best regards,<br>The CampusConnect Team</p>
                    </div>
                </body>
                </html>";
            
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendEventReminderAsync(string to, string eventTitle, string eventDate)
        {
            var subject = $"Reminder: {eventTitle} is Tomorrow! 📅";
            var body = $@"
                <!DOCTYPE html>
                <html lang=""en"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>Event Reminder</title>
                    <style>
                        body {{
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f8fafc;
                        }}
                        .container {{
                            background: white;
                            border-radius: 12px;
                            padding: 40px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }}
                        .reminder-icon {{
                            text-align: center;
                            font-size: 48px;
                            margin: 20px 0;
                        }}
                        .event-details {{
                            background: linear-gradient(135deg, #f59e0b, #f97316);
                            color: white;
                            padding: 24px;
                            border-radius: 8px;
                            margin: 20px 0;
                            text-align: center;
                        }}
                        .event-details h2 {{
                            margin: 0 0 10px;
                            font-size: 24px;
                        }}
                        .urgent-reminder {{
                            background-color: #fef3cd;
                            border: 1px solid #fbbf24;
                            border-radius: 8px;
                            padding: 16px;
                            margin: 20px 0;
                            color: #92400e;
                            text-align: center;
                        }}
                    </style>
                </head>
                <body>
                    <div class=""container"">
                        <div class=""reminder-icon"">⏰</div>
                        <h1>Event Reminder</h1>
                        <p>This is a friendly reminder that you're registered for an event happening soon:</p>
                        
                        <div class=""event-details"">
                            <h2>{eventTitle}</h2>
                            <p><strong>📅 Date:</strong> {eventDate}</p>
                        </div>
                        
                        <div class=""urgent-reminder"">
                            <h3>⚡ Don't Miss Out!</h3>
                            <p>The event is tomorrow. Make sure to mark your calendar!</p>
                        </div>
                        
                        <p>We're excited to see you there! Looking forward to a great event.</p>
                        <p>Best regards,<br>The CampusConnect Team</p>
                    </div>
                </body>
                </html>";
            
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendAnnouncementNotificationAsync(string to, string announcementTitle, string associationName)
        {
            var subject = $"New Announcement from {associationName} 📢";
            var exploreUrl = $"{_configuration["App:FrontendUrl"] ?? "http://localhost:5173"}/associations";
            
            var body = $@"
                <!DOCTYPE html>
                <html lang=""en"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>New Announcement</title>
                    <style>
                        body {{
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f8fafc;
                        }}
                        .container {{
                            background: white;
                            border-radius: 12px;
                            padding: 40px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }}
                        .announcement-icon {{
                            text-align: center;
                            font-size: 48px;
                            margin: 20px 0;
                        }}
                        .announcement-details {{
                            background: linear-gradient(135deg, #8b5cf6, #a855f7);
                            color: white;
                            padding: 24px;
                            border-radius: 8px;
                            margin: 20px 0;
                            text-align: center;
                        }}
                        .announcement-details h2 {{
                            margin: 0 0 10px;
                            font-size: 24px;
                        }}
                        .cta-button {{
                            display: inline-block;
                            background: linear-gradient(135deg, #06b6d4, #14b8a6);
                            color: white;
                            text-decoration: none;
                            padding: 16px 32px;
                            border-radius: 8px;
                            font-weight: 600;
                            font-size: 16px;
                            text-align: center;
                            margin: 20px 0;
                        }}
                    </style>
                </head>
                <body>
                    <div class=""container"">
                        <div class=""announcement-icon"">📢</div>
                        <h1>New Announcement</h1>
                        <p>{associationName} has posted a new announcement that might interest you:</p>
                        
                        <div class=""announcement-details"">
                            <h2>{announcementTitle}</h2>
                            <p><strong>From:</strong> {associationName}</p>
                        </div>
                        
                        <div style=""text-align: center;"">
                            <a href=""{exploreUrl}"" class=""cta-button"">View Full Announcement</a>
                        </div>
                        
                        <p>Visit CampusConnect to read the full announcement and stay updated with your favorite associations.</p>
                        <p>Best regards,<br>The CampusConnect Team</p>
                    </div>
                </body>
                </html>";
            
            await SendEmailAsync(to, subject, body);
        }
    }
} 