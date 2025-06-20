using ConnectCampus.Infrastructure.Configuration.Settings;
using FluentValidation;

namespace ConnectCampus.Infrastructure.Configuration.Validators;

public class EmailSettingsValidator : AbstractValidator<EmailSettings>
{
    public EmailSettingsValidator()
    {
        RuleFor(x => x.SmtpServer)
            .NotEmpty()
            .WithMessage("SMTP Server is required");

        RuleFor(x => x.SmtpPort)
            .GreaterThan(0)
            .WithMessage("SMTP Port must be greater than 0");

        RuleFor(x => x.SmtpUsername)
            .NotEmpty()
            .WithMessage("SMTP Username is required");

        RuleFor(x => x.SmtpPassword)
            .NotEmpty()
            .WithMessage("SMTP Password is required");

        RuleFor(x => x.FromEmail)
            .NotEmpty()
            .WithMessage("From Email is required")
            .EmailAddress()
            .WithMessage("From Email must be a valid email address");

        RuleFor(x => x.FromName)
            .NotEmpty()
            .WithMessage("From Name is required");
    }
} 