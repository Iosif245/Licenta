using FluentValidation;
using ConnectCampus.Application.Validation;

namespace ConnectCampus.Application.Features.Announcements.Commands.AddComment
{
    public class AddCommentCommandValidator : AbstractValidator<AddCommentCommand>
    {
        public AddCommentCommandValidator()
        {
            RuleFor(x => x.AnnouncementId)
                .NotEmpty()
                .WithMessage(ValidationErrors.Announcement.NotFound.Message);

            RuleFor(x => x.AuthorId)
                .NotEmpty()
                .WithMessage(ValidationErrors.Comment.InvalidAuthor.Message);

            RuleFor(x => x.AuthorType)
                .NotNull()
                .WithMessage(ValidationErrors.Comment.InvalidAuthor.Message);

            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage(ValidationErrors.Comment.InvalidContent.Message)
                .MaximumLength(1000)
                .WithMessage(ValidationErrors.Comment.ContentTooLong.Message);
        }
    }
} 