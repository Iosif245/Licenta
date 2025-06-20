using FluentValidation;

namespace ConnectCampus.Application.Features.Follows.Commands.DeleteFollow
{
    public class DeleteFollowCommandValidator : AbstractValidator<DeleteFollowCommand>
    {
        public DeleteFollowCommandValidator()
        {
            RuleFor(x => x.StudentId)
                .NotEmpty().WithMessage("Student ID is required");

            RuleFor(x => x.AssociationId)
                .NotEmpty().WithMessage("Association ID is required");
        }
    }
} 