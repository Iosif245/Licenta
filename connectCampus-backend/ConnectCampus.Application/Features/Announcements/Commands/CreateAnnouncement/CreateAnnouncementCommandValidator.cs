using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using FluentValidation;

namespace ConnectCampus.Application.Features.Announcements.Commands.CreateAnnouncement
{
    public class CreateAnnouncementCommandValidator : AbstractValidator<CreateAnnouncementCommand>
    {
        public CreateAnnouncementCommandValidator(
            IAssociationRepository associationRepository, 
            IEventRepository eventRepository)
        {
            RuleFor(x => x.AssociationId)
                .NotEmpty()
                .MustAsync(async (id, cancellation) => await associationRepository.ExistsByIdAsync(id, cancellation))
                .WithMessage(ValidationErrors.Association.NotFound.Message);
                
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Title is required")
                .MaximumLength(200)
                .WithMessage("Title must not exceed 200 characters");
                
            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage("Content is required")
                .MaximumLength(2000)
                .WithMessage("Content must not exceed 2000 characters");
                
            RuleFor(x => x.EventId)
                .MustAsync(async (id, cancellation) => 
                    !id.HasValue || await eventRepository.ExistsByIdAsync(id.Value, cancellation))
                .When(x => x.EventId.HasValue)
                .WithMessage(ValidationErrors.Event.NotFound.Message);
        }
    }
} 