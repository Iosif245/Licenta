using System;
using ConnectCampus.Application.Abstractions.Repositories;
using FluentValidation;

namespace ConnectCampus.Application.Features.Events.Commands.UpdateEvent
{
    public class UpdateEventCommandValidator : AbstractValidator<UpdateEventCommand>
    {
        public UpdateEventCommandValidator(IEventRepository eventRepository)
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Event ID is required")
                .MustAsync(async (id, cancellation) => 
                    await eventRepository.GetByIdAsync(id, cancellation) != null)
                .WithMessage("Event not found");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(100).WithMessage("Title must not exceed 100 characters");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start date is required");

            RuleFor(x => x.EndDate)
                .NotEmpty().WithMessage("End date is required")
                .Must((cmd, endDate) => endDate > cmd.StartDate)
                .WithMessage("End date must be after start date");

            RuleFor(x => x.Timezone)
                .NotEmpty().WithMessage("Timezone is required")
                .MaximumLength(50).WithMessage("Timezone must not exceed 50 characters");

            RuleFor(x => x.Location)
                .NotEmpty().WithMessage("Location is required")
                .MaximumLength(200).WithMessage("Location must not exceed 200 characters");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required")
                .MaximumLength(50).WithMessage("Category must not exceed 50 characters");

            RuleFor(x => x.Capacity)
                .GreaterThan(0).WithMessage("Capacity must be greater than 0");

            RuleFor(x => x.RegistrationDeadline)
                .Must((cmd, deadline) => !deadline.HasValue || deadline.Value < cmd.StartDate)
                .When(x => x.RegistrationDeadline.HasValue)
                .WithMessage("Registration deadline must be before the event start date");

            RuleFor(x => x.RegistrationUrl)
                .MaximumLength(2000).WithMessage("Registration URL must not exceed 2000 characters");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0")
                .When(x => x.Price.HasValue && !x.IsFree);

            RuleFor(x => x.ContactEmail)
                .EmailAddress().WithMessage("Contact email must be a valid email address")
                .When(x => !string.IsNullOrEmpty(x.ContactEmail))
                .MaximumLength(100).WithMessage("Contact email must not exceed 100 characters");

            RuleFor(x => x.PaymentMethod)
                .NotEmpty().WithMessage("Payment method is required")
                .When(x => !x.IsFree && x.Price > 0)
                .MaximumLength(50).WithMessage("Payment method must not exceed 50 characters");

            RuleFor(x => x.MaxAttendees)
                .GreaterThan(0).WithMessage("Maximum attendees must be greater than 0")
                .When(x => x.MaxAttendees.HasValue);
        }
    }
} 