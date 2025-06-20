using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using FluentValidation;

namespace ConnectCampus.Application.Features.Announcements.Commands.UpdateAnnouncement
{
    public class UpdateAnnouncementCommandValidator : AbstractValidator<UpdateAnnouncementCommand>
    {
        public UpdateAnnouncementCommandValidator(IAnnouncementRepository announcementRepository)
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .MustAsync(async (id, cancellation) => await announcementRepository.ExistsByIdAsync(id, cancellation))
                .WithMessage(ValidationErrors.Announcement.NotFound.Message);
                
            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(200)
                .WithMessage(ValidationErrors.Announcement.InvalidTitle.Message);
                
            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage(ValidationErrors.Announcement.InvalidContent.Message);
                
            // Image validation is handled at the controller level for IFormFile
            // No need to validate Image property here since it's optional
        }
    }
} 
 
 