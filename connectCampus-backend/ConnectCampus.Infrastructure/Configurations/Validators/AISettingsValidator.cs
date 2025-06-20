using ConnectCampus.Infrastructure.Configuration.Settings;
using FluentValidation;

namespace ConnectCampus.Infrastructure.Configuration.Validators;

public class AISettingsValidator : AbstractValidator<AISettings>
{
    public AISettingsValidator()
    {
        RuleFor(x => x.GeminiApiKey)
            .NotEmpty()
            .WithMessage("Gemini API Key is required");

        RuleFor(x => x.GeminiModel)
            .NotEmpty()
            .WithMessage("Gemini Model is required");

        RuleFor(x => x.GeminiBaseUrl)
            .NotEmpty()
            .WithMessage("Gemini Base URL is required")
            .Must(BeValidUrl)
            .WithMessage("Gemini Base URL must be a valid URL");

        RuleFor(x => x.Temperature)
            .GreaterThanOrEqualTo(0)
            .LessThanOrEqualTo(2)
            .WithMessage("Temperature must be between 0 and 2");

        RuleFor(x => x.MaxTokens)
            .GreaterThan(0)
            .WithMessage("Max tokens must be greater than 0");
    }

    private static bool BeValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out _);
    }
} 