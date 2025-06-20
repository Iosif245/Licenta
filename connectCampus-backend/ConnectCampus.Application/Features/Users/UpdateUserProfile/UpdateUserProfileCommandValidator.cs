using FluentValidation;
using ConnectCampus.Application.Common.Behaviors;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;

namespace ConnectCampus.Application.Features.Users.UpdateUserProfile;

public class UpdateUserProfileCommandValidator : AbstractValidator<UpdateUserProfileCommand>
{
    public UpdateUserProfileCommandValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithError(ValidationErrors.User.FirstNameRequired)
            .MinimumLength(4).WithError(ValidationErrors.User.FirstNameMinLength)
            .MaximumLength(50).WithError(ValidationErrors.User.FirstNameMaxLength);

        RuleFor(x => x.LastName)
            .NotEmpty().WithError(ValidationErrors.User.LastNameRequired)
            .MinimumLength(4).WithError(ValidationErrors.User.LastNameMinLength)
            .MaximumLength(50).WithError(ValidationErrors.User.LastNameMaxLength);

        RuleFor(x => x.Location)
            .MaximumLength(100).WithError(ValidationErrors.User.LocationMaxLength);

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20).WithError(ValidationErrors.User.PhoneNumberMaxLength)
            .Matches(@"^\+?[1-9]\d{1,14}$").WithError(ValidationErrors.User.PhoneNumberInvalidFormat)
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));

        RuleFor(x => x.Bio)
            .MaximumLength(500).WithError(ValidationErrors.User.BioMaxLength);
    }
}