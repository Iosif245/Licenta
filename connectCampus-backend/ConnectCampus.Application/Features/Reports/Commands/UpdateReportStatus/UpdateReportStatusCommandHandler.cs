using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Reports.Commands.UpdateReportStatus
{
    public class UpdateReportStatusCommandHandler : ICommandHandler<UpdateReportStatusCommand, bool>
    {
        private readonly IReportRepository _reportRepository;
        private readonly IUnitOfWork _unitOfWork;
        
        public UpdateReportStatusCommandHandler(
            IReportRepository reportRepository,
            IUnitOfWork unitOfWork)
        {
            _reportRepository = reportRepository;
            _unitOfWork = unitOfWork;
        }
        
        public async Task<Result<bool>> Handle(UpdateReportStatusCommand request, CancellationToken cancellationToken)
        {
            var report = await _reportRepository.GetByIdAsync(request.Id, cancellationToken);
            if (report == null)
            {
                return Result.Failure<bool>(ValidationErrors.Report.NotFound);
            }
            
            report.UpdateStatus(request.Status);
            _reportRepository.Update(report);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
    }
} 