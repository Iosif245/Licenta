using FluentValidation;

namespace ConnectCampus.Application.Features.Chat.CreateChatGroup;

public class CreateChatGroupCommandValidator : AbstractValidator<CreateChatGroupCommand>
{
    public CreateChatGroupCommandValidator()
    {
        RuleFor(x => x.StudentId)
            .NotEmpty()
            .WithMessage("Student ID is required");

        RuleFor(x => x.AssociationId)
            .NotEmpty()
            .WithMessage("Association ID is required");

        RuleFor(x => x.StudentId)
            .NotEqual(x => x.AssociationId)
            .WithMessage("Student ID and Association ID cannot be the same");
    }
} 