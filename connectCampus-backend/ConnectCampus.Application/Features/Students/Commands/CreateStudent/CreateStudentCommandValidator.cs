using ConnectCampus.Application.Abstractions.Repositories;
using FluentValidation;

namespace ConnectCampus.Application.Features.Students.Commands.CreateStudent
{
    public class CreateStudentCommandValidator : AbstractValidator<CreateStudentCommand>
    {
        public CreateStudentCommandValidator(IStudentRepository studentRepository)
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email format is invalid")
                .MustAsync(async (email, cancellation) => 
                    !(await studentRepository.ExistsByEmailAsync(email, cancellation)))
                .WithMessage("A student with this email already exists");

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
                .GreaterThan(0).WithMessage("Study year must be positive");

            RuleFor(x => x.EducationLevel)
                .NotNull().WithMessage("Education level is required");
        }
    }
} 