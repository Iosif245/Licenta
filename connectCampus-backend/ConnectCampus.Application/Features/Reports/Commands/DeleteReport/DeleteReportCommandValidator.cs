using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using FluentValidation;

namespace ConnectCampus.Application.Features.Reports.Commands.DeleteReport
{
    public class DeleteReportCommandValidator : AbstractValidator<DeleteReportCommand>
    {
        public DeleteReportCommandValidator(IReportRepository reportRepository)
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .MustAsync(async (id, cancellation) => await reportRepository.ExistsByIdAsync(id, cancellation))
                .WithMessage(ValidationErrors.Report.NotFound.Message);
        }
    }
} 