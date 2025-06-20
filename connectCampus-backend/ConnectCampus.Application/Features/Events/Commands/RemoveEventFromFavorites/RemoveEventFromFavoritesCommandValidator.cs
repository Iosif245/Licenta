using FluentValidation;

namespace ConnectCampus.Application.Features.Events.Commands.RemoveEventFromFavorites
{
    public class RemoveEventFromFavoritesCommandValidator : AbstractValidator<RemoveEventFromFavoritesCommand>
    {
        public RemoveEventFromFavoritesCommandValidator()
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