using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Reports.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Reports.Queries.GetReport
{
    public class GetReportQueryHandler : IQueryHandler<GetReportQuery, ReportDto>
    {
        private readonly IReportRepository _reportRepository;

        public GetReportQueryHandler(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        public async Task<Maybe<ReportDto>> Handle(GetReportQuery request, CancellationToken cancellationToken)
        {
            var report = await _reportRepository.GetByIdAsync(request.Id, cancellationToken);

            if (report == null)
            {
                return Maybe<ReportDto>.None;
            }

            return new ReportDto(
                report.Id,
                report.UserId,
                report.Reason,
                report.Description,
                report.Status,
                report.CreatedAt,
                report.UpdatedAt,
                report.TargetId,
                report.TargetType
            );
        }
    }
} 