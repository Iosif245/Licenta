using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Enums;
using FluentValidation;

namespace ConnectCampus.Application.Features.Reports.Commands.UpdateReportStatus
{
    public class UpdateReportStatusCommandValidator : AbstractValidator<UpdateReportStatusCommand>
    {
        public UpdateReportStatusCommandValidator(IReportRepository reportRepository)
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .MustAsync(async (id, cancellation) => await reportRepository.ExistsByIdAsync(id, cancellation))
                .WithMessage(ValidationErrors.Report.NotFound.Message);
                
            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage(ValidationErrors.Report.InvalidStatus.Message);
        }
    }
} 