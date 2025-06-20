using FluentValidation;
using ConnectCampus.Application.Common.Behaviors;
using ConnectCampus.Application.Validation;

namespace ConnectCampus.Application.Features.Users.Login
{
    public class LoginCommandValidator : AbstractValidator<LoginCommand>
    {
        public LoginCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithError(ValidationErrors.Auth.EmailRequired)
                .EmailAddress().WithError(ValidationErrors.Auth.InvalidEmail);

            RuleFor(x => x.Password)
                .NotEmpty().WithError(ValidationErrors.Auth.PasswordRequired);
        }
    }
} 