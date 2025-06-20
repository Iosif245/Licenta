using System;
using System.Text.RegularExpressions;
using ConnectCampus.Application.Abstractions.Repositories;
using FluentValidation;

namespace ConnectCampus.Application.Features.Associations.Commands.CreateAssociation
{
    public class CreateAssociationCommandValidator : AbstractValidator<CreateAssociationCommand>
    {
        private static readonly Regex SlugRegex = new Regex("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.Compiled);
        
        public CreateAssociationCommandValidator(IAssociationRepository associationRepository)
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters")
                .MustAsync(async (name, cancellation) => 
                    !(await associationRepository.ExistsByNameAsync(name, cancellation)))
                .WithMessage("An association with this name already exists");

            RuleFor(x => x.Slug)
                .NotEmpty().WithMessage("Slug is required")
                .MaximumLength(100).WithMessage("Slug cannot exceed 100 characters")
                .Matches(SlugRegex).WithMessage("Slug format is invalid. Use only lowercase letters, numbers, and hyphens.")
                .MustAsync(async (slug, cancellation) =>
                    !(await associationRepository.ExistsBySlugAsync(slug, cancellation)))
                .WithMessage("An association with this slug already exists");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required")
                .MaximumLength(5000).WithMessage("Description cannot exceed 5000 characters");

            RuleFor(x => x.Logo)
                .NotEmpty().WithMessage("Logo is required")
                .MaximumLength(255).WithMessage("Logo URL cannot exceed 255 characters");

            RuleFor(x => x.CoverImage)
                .NotEmpty().WithMessage("Cover image is required")
                .MaximumLength(255).WithMessage("Cover image URL cannot exceed 255 characters");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required")
                .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");

            RuleFor(x => x.FoundedYear)
                .NotEmpty().WithMessage("Founded year is required")
                .LessThanOrEqualTo(DateTime.UtcNow.Year).WithMessage("Founded year cannot be in the future");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email format is invalid")
                .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

            RuleFor(x => x.Location)
                .MaximumLength(255).WithMessage("Location cannot exceed 255 characters");

            RuleFor(x => x.Website)
                .MaximumLength(255).WithMessage("Website cannot exceed 255 characters");

            RuleFor(x => x.Phone)
                .MaximumLength(50).WithMessage("Phone cannot exceed 50 characters");

            RuleFor(x => x.Address)
                .MaximumLength(500).WithMessage("Address cannot exceed 500 characters");

            RuleFor(x => x.Facebook)
                .MaximumLength(255).WithMessage("Facebook URL cannot exceed 255 characters");

            RuleFor(x => x.Twitter)
                .MaximumLength(255).WithMessage("Twitter URL cannot exceed 255 characters");

            RuleFor(x => x.Instagram)
                .MaximumLength(255).WithMessage("Instagram URL cannot exceed 255 characters");

            RuleFor(x => x.LinkedIn)
                .MaximumLength(255).WithMessage("LinkedIn URL cannot exceed 255 characters");
        }
    }
} 