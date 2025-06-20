using System;
using FluentValidation;

namespace ConnectCampus.Application.Features.Associations.Commands.RegisterAssociation
{
    public class RegisterAssociationCommandValidator : AbstractValidator<RegisterAssociationCommand>
    {
        public RegisterAssociationCommandValidator()
        {
            // Required fields validation
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email format is invalid");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter")
                .Matches("[0-9]").WithMessage("Password must contain at least one number");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Association name is required")
                .MaximumLength(100).WithMessage("Association name cannot exceed 100 characters");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required")
                .MaximumLength(5000).WithMessage("Description cannot exceed 5000 characters");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required")
                .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");

            RuleFor(x => x.FoundedYear)
                .GreaterThan(1800).WithMessage("Founded year must be after 1800")
                .LessThanOrEqualTo(DateTime.Now.Year).WithMessage("Founded year cannot be in the future");

            RuleFor(x => x.Logo)
                .NotNull().WithMessage("Logo is required");

            RuleFor(x => x.CoverImage)
                .NotNull().WithMessage("Cover image is required");

            // Optional fields validation
            RuleFor(x => x.Website)
                .Must(BeValidUrl).WithMessage("Website must be a valid URL")
                .When(x => !string.IsNullOrEmpty(x.Website));

            RuleFor(x => x.Phone)
                .MaximumLength(50).WithMessage("Phone number cannot exceed 50 characters")
                .When(x => !string.IsNullOrEmpty(x.Phone));

            RuleFor(x => x.Address)
                .MaximumLength(500).WithMessage("Address cannot exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.Address));

            RuleFor(x => x.Location)
                .MaximumLength(255).WithMessage("Location cannot exceed 255 characters")
                .When(x => !string.IsNullOrEmpty(x.Location));

            // Social media URL validations
            RuleFor(x => x.Facebook)
                .Must(BeValidUrl).WithMessage("Facebook URL must be valid")
                .When(x => !string.IsNullOrEmpty(x.Facebook));

            RuleFor(x => x.Twitter)
                .Must(BeValidUrl).WithMessage("Twitter URL must be valid")
                .When(x => !string.IsNullOrEmpty(x.Twitter));

            RuleFor(x => x.Instagram)
                .Must(BeValidUrl).WithMessage("Instagram URL must be valid")
                .When(x => !string.IsNullOrEmpty(x.Instagram));

            RuleFor(x => x.LinkedIn)
                .Must(BeValidUrl).WithMessage("LinkedIn URL must be valid")
                .When(x => !string.IsNullOrEmpty(x.LinkedIn));
        }

        private static bool BeValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url))
                return true;
                
            return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
                   (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
        }
    }
} 