using FluentValidation;

namespace ConnectCampus.Application.Features.Events.Commands.UnregisterFromEvent
{
    public class UnregisterFromEventCommandValidator : AbstractValidator<UnregisterFromEventCommand>
    {
        public UnregisterFromEventCommandValidator()
        {
            RuleFor(x => x.EventId)
                .NotEmpty()
                .WithMessage("Event ID is required");

            RuleFor(x => x.StudentId)
                .NotEmpty()
                .WithMessage("Student ID is required");
        }
    }
} 