using FluentValidation;
using ConnectCampus.Application.Validation;

namespace ConnectCampus.Application.Features.Announcements.Commands.UpdateComment
{
    public class UpdateCommentCommandValidator : AbstractValidator<UpdateCommentCommand>
    {
        public UpdateCommentCommandValidator()
        {
            RuleFor(x => x.CommentId)
                .NotEmpty()
                .WithMessage(ValidationErrors.Comment.NotFound.Message);

            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage(ValidationErrors.Comment.InvalidContent.Message)
                .MaximumLength(1000)
                .WithMessage(ValidationErrors.Comment.ContentTooLong.Message);
        }
    }
} 
 
 