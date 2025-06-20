using FluentValidation;
using ConnectCampus.Application.Features.Chat.SendMessage;

namespace ConnectCampus.Application.Features.Chat.SendMessage;

public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
{
    public SendMessageCommandValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage("Message content cannot be empty")
            .MaximumLength(1000)
            .WithMessage("Message content cannot exceed 1000 characters");

        RuleFor(x => x.ChatGroupId)
            .NotEmpty()
            .WithMessage("Chat group ID is required");
    }
} 