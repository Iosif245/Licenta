using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Reports.Commands.CreateReport
{
    public class CreateReportCommandHandler : ICommandHandler<CreateReportCommand, Guid>
    {
        private readonly IReportRepository _reportRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        
        public CreateReportCommandHandler(
            IReportRepository reportRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _reportRepository = reportRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }
        
        public async Task<Result<Guid>> Handle(CreateReportCommand request, CancellationToken cancellationToken)
        {
            // Check if user exists
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                return Result.Failure<Guid>(ValidationErrors.User.NotFound);
            }
            
            // Create the report
            var reportId = Guid.NewGuid();
            var report = new Report(
                reportId,
                request.UserId,
                request.Reason,
                request.Description,
                request.TargetId,
                request.TargetType
            );
            
            _reportRepository.Add(report);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(reportId);
        }
    }
} 