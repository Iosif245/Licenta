using ConnectCampus.Application.Abstractions.Repositories;
using FluentValidation;

namespace ConnectCampus.Application.Features.Follows.Commands.CreateFollow
{
    public class CreateFollowCommandValidator : AbstractValidator<CreateFollowCommand>
    {
        public CreateFollowCommandValidator(IStudentRepository studentRepository, IAssociationRepository associationRepository)
        {
            RuleFor(x => x.StudentId)
                .NotEmpty().WithMessage("Student ID is required")
                .MustAsync(async (id, cancellation) => 
                    await studentRepository.GetByIdAsync(id, cancellation) != null)
                .WithMessage("Student not found");

            RuleFor(x => x.AssociationId)
                .NotEmpty().WithMessage("Association ID is required")
                .MustAsync(async (id, cancellation) => 
                    await associationRepository.GetByIdAsync(id, cancellation) != null)
                .WithMessage("Association not found");
        }
    }
} 