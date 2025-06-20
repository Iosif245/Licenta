using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using FluentValidation;

namespace ConnectCampus.Application.Features.Reports.Commands.UpdateReport
{
    public class UpdateReportCommandValidator : AbstractValidator<UpdateReportCommand>
    {
        public UpdateReportCommandValidator(IReportRepository reportRepository)
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .MustAsync(async (id, cancellation) => await reportRepository.ExistsByIdAsync(id, cancellation))
                .WithMessage(ValidationErrors.Report.NotFound.Message);
                
            RuleFor(x => x.Reason)
                .NotEmpty()
                .MaximumLength(200)
                .WithMessage(ValidationErrors.Report.InvalidReason.Message);
                
            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(1000)
                .WithMessage(ValidationErrors.Report.InvalidDescription.Message);
        }
    }
} 