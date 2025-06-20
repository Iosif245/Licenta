using FluentValidation;

namespace ConnectCampus.Application.Features.Students.Commands.UpdateStudent
{
    public class UpdateStudentCommandValidator : AbstractValidator<UpdateStudentCommand>
    {
        public UpdateStudentCommandValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MaximumLength(50).WithMessage("First name cannot exceed 50 characters");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters");

            RuleFor(x => x.Bio)
                .MaximumLength(500).WithMessage("Bio cannot exceed 500 characters");

            RuleFor(x => x.University)
                .NotEmpty().WithMessage("University is required")
                .MaximumLength(100).WithMessage("University name cannot exceed 100 characters");

            RuleFor(x => x.Faculty)
                .NotEmpty().WithMessage("Faculty is required")
                .MaximumLength(100).WithMessage("Faculty name cannot exceed 100 characters");

            RuleFor(x => x.Specialization)
                .NotEmpty().WithMessage("Specialization is required")
                .MaximumLength(100).WithMessage("Specialization cannot exceed 100 characters");

            RuleFor(x => x.StudyYear)
                .GreaterThan(0).WithMessage("Study year must be positive");

            RuleFor(x => x.EducationLevel)
                .NotNull().WithMessage("Education level is required");

            RuleFor(x => x.LinkedInUrl)
                .MaximumLength(255).WithMessage("LinkedIn URL cannot exceed 255 characters");

            RuleFor(x => x.GitHubUrl)
                .MaximumLength(255).WithMessage("GitHub URL cannot exceed 255 characters");

            RuleFor(x => x.FacebookUrl)
                .MaximumLength(255).WithMessage("Facebook URL cannot exceed 255 characters");
        }
    }
} 