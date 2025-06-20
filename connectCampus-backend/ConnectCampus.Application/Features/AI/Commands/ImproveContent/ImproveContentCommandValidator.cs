using FluentValidation;

namespace ConnectCampus.Application.Features.AI.Commands.ImproveContent;

public class ImproveContentCommandValidator : AbstractValidator<ImproveContentCommand>
{
    public ImproveContentCommandValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage("Content is required")
            .MinimumLength(10)
            .WithMessage("Content must be at least 10 characters long")
            .MaximumLength(5000)
            .WithMessage("Content cannot exceed 5000 characters");

        RuleFor(x => x.Type)
            .NotEmpty()
            .WithMessage("Content type is required")
            .Must(BeValidContentType)
            .WithMessage("Content type must be either 'announcement' or 'event'");
    }

    private static bool BeValidContentType(string type)
    {
        return type is "announcement" or "event";
    }
} 