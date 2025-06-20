using FluentValidation;

namespace ConnectCampus.Application.Features.Events.Commands.AddEventToFavorites
{
    public class AddEventToFavoritesCommandValidator : AbstractValidator<AddEventToFavoritesCommand>
    {
        public AddEventToFavoritesCommandValidator()
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