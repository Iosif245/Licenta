using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Reports.Commands.DeleteReport
{
    public class DeleteReportCommandHandler : ICommandHandler<DeleteReportCommand, bool>
    {
        private readonly IReportRepository _reportRepository;
        private readonly IUnitOfWork _unitOfWork;
        
        public DeleteReportCommandHandler(
            IReportRepository reportRepository,
            IUnitOfWork unitOfWork)
        {
            _reportRepository = reportRepository;
            _unitOfWork = unitOfWork;
        }
        
        public async Task<Result<bool>> Handle(DeleteReportCommand request, CancellationToken cancellationToken)
        {
            // Get the report by id
            var report = await _reportRepository.GetByIdAsync(request.Id, cancellationToken);
            if (report == null)
            {
                return Result.Failure<bool>(ValidationErrors.Report.NotFound);
            }
            
            // Delete the report
            _reportRepository.Remove(report);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
    }
} 