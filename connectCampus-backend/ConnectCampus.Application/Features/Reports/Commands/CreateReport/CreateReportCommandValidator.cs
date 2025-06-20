using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using FluentValidation;

namespace ConnectCampus.Application.Features.Reports.Commands.CreateReport
{
    public class CreateReportCommandValidator : AbstractValidator<CreateReportCommand>
    {
        public CreateReportCommandValidator(IUserRepository userRepository)
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .MustAsync(async (id, cancellation) => await userRepository.ExistsByIdAsync(id, cancellation))
                .WithMessage("User not found.");
                
            RuleFor(x => x.Reason)
                .NotEmpty()
                .MaximumLength(200)
                .WithMessage(ValidationErrors.Report.InvalidReason.Message);
                
            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(1000)
                .WithMessage(ValidationErrors.Report.InvalidDescription.Message);
                
            RuleFor(x => x.TargetType)
                .NotEmpty()
                .MaximumLength(50)
                .WithMessage(ValidationErrors.Report.InvalidTargetType.Message);
        }
    }
} 