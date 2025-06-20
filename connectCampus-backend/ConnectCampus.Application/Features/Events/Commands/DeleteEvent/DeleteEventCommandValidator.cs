using System;
using ConnectCampus.Application.Abstractions.Repositories;
using FluentValidation;

namespace ConnectCampus.Application.Features.Events.Commands.DeleteEvent
{
    public class DeleteEventCommandValidator : AbstractValidator<DeleteEventCommand>
    {
        public DeleteEventCommandValidator(IEventRepository eventRepository)
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Event ID is required")
                .MustAsync(async (id, cancellation) => 
                    await eventRepository.GetByIdAsync(id, cancellation) != null)
                .WithMessage("Event not found");
        }
    }
} 