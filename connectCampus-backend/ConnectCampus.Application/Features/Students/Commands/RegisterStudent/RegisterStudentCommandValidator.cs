using FluentValidation;

namespace ConnectCampus.Application.Features.Students.Commands.RegisterStudent
{
    public class RegisterStudentCommandValidator : AbstractValidator<RegisterStudentCommand>
    {
        public RegisterStudentCommandValidator()
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

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MaximumLength(50).WithMessage("First name cannot exceed 50 characters");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters");

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
                .GreaterThan(0).WithMessage("Study year must be positive")
                .LessThanOrEqualTo(10).WithMessage("Study year cannot exceed 10");

            RuleFor(x => x.EducationLevel)
                .NotNull().WithMessage("Education level is required");

            RuleFor(x => x.Avatar)
                .NotNull().WithMessage("Avatar is required");
        }
    }
} 