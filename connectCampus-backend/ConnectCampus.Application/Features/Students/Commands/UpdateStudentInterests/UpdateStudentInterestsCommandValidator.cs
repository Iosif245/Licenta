using FluentValidation;

namespace ConnectCampus.Application.Features.Students.Commands.UpdateStudentInterests
{
    public class UpdateStudentInterestsCommandValidator : AbstractValidator<UpdateStudentInterestsCommand>
    {
        public UpdateStudentInterestsCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Student ID is required");

            RuleForEach(x => x.Interests)
                .NotEmpty().WithMessage("Interest cannot be empty")
                .MaximumLength(100).WithMessage("Interest cannot exceed 100 characters");

            RuleFor(x => x.Interests)
                .NotNull().WithMessage("Interests cannot be null");
        }
    }
} 