using ConnectCampus.Application.Abstractions.Repositories;
using FluentValidation;

namespace ConnectCampus.Application.Features.Events.Commands.RegisterForEvent
{
    public class RegisterForEventCommandValidator : AbstractValidator<RegisterForEventCommand>
    {
        public RegisterForEventCommandValidator(
            IStudentRepository studentRepository,
            IEventRepository eventRepository,
            IStudentEventRegistrationRepository registrationRepository)
        {
            RuleFor(x => x.StudentId)
                .NotEmpty().WithMessage("Student ID is required")
                .MustAsync(async (id, cancellation) => 
                    await studentRepository.GetByIdAsync(id, cancellation) != null)
                .WithMessage("Student not found");

            RuleFor(x => x.EventId)
                .NotEmpty().WithMessage("Event ID is required")
                .MustAsync(async (id, cancellation) => 
                    await eventRepository.GetByIdAsync(id, cancellation) != null)
                .WithMessage("Event not found");

            RuleFor(x => x)
                .MustAsync(async (command, cancellation) => 
                    !await registrationRepository.ExistsByStudentAndEventAsync(command.StudentId, command.EventId, cancellation))
                .WithMessage("Student is already registered for this event");
        }
    }
} 