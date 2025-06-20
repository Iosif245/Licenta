using ConnectCampus.Infrastructure.Configuration.Settings;
using FluentValidation;

namespace ConnectCampus.Infrastructure.Configuration.Validators;

public class RefreshTokenValidator : AbstractValidator<RefreshTokenSettings>
{
    public RefreshTokenValidator()
    {
        RuleFor(x => x.Length)
            .NotEmpty().WithMessage("Refresh token length is required.");
        RuleFor(x => x.ExpiryInDays)
            .NotEmpty().WithMessage("Refresh token expiry days is required.");

    }

}