using FluentValidation;
using ConnectCampus.Application.Common.Behaviors;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;

namespace ConnectCampus.Application.Features.Users.Register
{
    public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
    {
        public RegisterUserCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithError(ValidationErrors.Auth.EmailRequired)
                .EmailAddress().WithError(ValidationErrors.Auth.InvalidEmail)
                .MaximumLength(255).WithError(ValidationErrors.User.EmailMaxLength);

            RuleFor(x => x.Password)
                .NotEmpty().WithError(ValidationErrors.Auth.PasswordRequired)
                .MinimumLength(8).WithError(ValidationErrors.Auth.PasswordTooShort)
                .Matches("[A-Z]").WithError(ValidationErrors.Auth.PasswordRequiresUppercase)
                .Matches("[a-z]").WithError(ValidationErrors.Auth.PasswordRequiresLowercase)
                .Matches("[0-9]").WithError(ValidationErrors.Auth.PasswordRequiresDigit)
                .Matches("[^a-zA-Z0-9]").WithError(ValidationErrors.Auth.PasswordRequiresNonAlphanumeric);
                
            RuleFor(x => x.Role)
                .NotEmpty().WithError(ValidationErrors.Auth.RoleRequired)
                .Must(role => UserRole.List().Any(r => r.Name == role))
                .WithError(ValidationErrors.Auth.InvalidRole);
        }
    }
} 