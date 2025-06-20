using ConnectCampus.Infrastructure.Configuration.Settings;
using FluentValidation;

namespace ConnectCampus.Infrastructure.Configuration.Validators
{
    public class JwtSettingsValidator : AbstractValidator<JwtSettings>
    {
        public JwtSettingsValidator()
        {
            RuleFor(x => x.Secret)
                .NotEmpty().WithMessage("JWT Secret is required.")
                .MinimumLength(32).WithMessage("JWT Secret must be at least 32 characters long.");

            RuleFor(x => x.Issuer)
                .NotEmpty().WithMessage("JWT Issuer is required.");

            RuleFor(x => x.Audience)
                .NotEmpty().WithMessage("JWT Audience is required.");

            RuleFor(x => x.ExpiryMinutes)
                .GreaterThan(0).WithMessage("JWT Expiry Minutes must be greater than 0.");
        }
    }
} 