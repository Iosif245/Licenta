using FluentValidation;
using ConnectCampus.Application.Common.Behaviors;
using ConnectCampus.Application.Validation;

namespace ConnectCampus.Application.Features.Announcements.Commands.LikeAnnouncement
{
    public class LikeAnnouncementCommandValidator : AbstractValidator<LikeAnnouncementCommand>
    {
        public LikeAnnouncementCommandValidator()
        {
            RuleFor(x => x.AnnouncementId)
                .NotEmpty().WithError(ValidationErrors.Announcement.NotFound);

            RuleFor(x => x.AuthorId)
                .NotEmpty().WithError(ValidationErrors.Comment.InvalidAuthor);

            RuleFor(x => x.AuthorType)
                .NotNull().WithError(ValidationErrors.Comment.InvalidAuthor);
        }
    }
} 