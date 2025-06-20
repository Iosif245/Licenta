using FluentValidation;
using ConnectCampus.Application.Common.Behaviors;
using ConnectCampus.Application.Validation;

namespace ConnectCampus.Application.Features.Auth.Commands.VerifyTwoFactor
{
    public class VerifyTwoFactorCommandValidator : AbstractValidator<VerifyTwoFactorCommand>
    {
        public VerifyTwoFactorCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithError(ValidationErrors.Auth.UserIdRequired)
                .Must(BeValidGuid).WithError(ValidationErrors.Auth.InvalidUserId);

            RuleFor(x => x.Code)
                .NotEmpty().WithError(ValidationErrors.Auth.TwoFactorCodeRequired)
                .Length(6).WithError(ValidationErrors.Auth.TwoFactorCodeInvalidLength)
                .Matches("^[0-9]{6}$").WithError(ValidationErrors.Auth.TwoFactorCodeInvalidFormat);
        }

        private static bool BeValidGuid(string value)
        {
            return Guid.TryParse(value, out _);
        }
    }
} 