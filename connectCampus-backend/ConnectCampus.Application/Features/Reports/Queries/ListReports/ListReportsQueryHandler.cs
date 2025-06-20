using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Reports.Dtos;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Reports.Queries.ListReports
{
    public class ListReportsQueryHandler : IQueryHandler<ListReportsQuery, List<ReportDto>>
    {
        private readonly IDbContext _dbContext;

        public ListReportsQueryHandler(IDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Maybe<List<ReportDto>>> Handle(ListReportsQuery request, CancellationToken cancellationToken)
        {
            var query = _dbContext.Set<Report>().AsQueryable();
            
            // Apply filters
            if (request.UserId.HasValue)
            {
                query = query.Where(r => r.UserId == request.UserId.Value);
            }
            
            if (request.Status.HasValue)
            {
                query = query.Where(r => r.Status == request.Status.Value);
            }
            
            if (request.TargetId.HasValue && !string.IsNullOrEmpty(request.TargetType))
            {
                query = query.Where(r => r.TargetId == request.TargetId.Value && r.TargetType == request.TargetType);
            }
            else if (request.TargetId.HasValue)
            {
                query = query.Where(r => r.TargetId == request.TargetId.Value);
            }
            else if (!string.IsNullOrEmpty(request.TargetType))
            {
                query = query.Where(r => r.TargetType == request.TargetType);
            }
            
            // Apply ordering
            query = query.OrderByDescending(r => r.CreatedAt);
            
            // Apply pagination
            var skip = (request.Page - 1) * request.PageSize;
            var reports = await query
                .Skip(skip)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);
            
            // Map to DTOs
            var dtos = reports.Select(r => new ReportDto(
                r.Id,
                r.UserId,
                r.Reason,
                r.Description,
                r.Status,
                r.CreatedAt,
                r.UpdatedAt,
                r.TargetId,
                r.TargetType
            )).ToList();
            
            return dtos;
        }
    }
} 