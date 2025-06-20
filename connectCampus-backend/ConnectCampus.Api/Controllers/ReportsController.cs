using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Models.Reports;
using ConnectCampus.Application.Features.Reports.Commands.CreateReport;
using ConnectCampus.Application.Features.Reports.Commands.DeleteReport;
using ConnectCampus.Application.Features.Reports.Commands.UpdateReport;
using ConnectCampus.Application.Features.Reports.Commands.UpdateReportStatus;
using ConnectCampus.Application.Features.Reports.Dtos;
using ConnectCampus.Application.Features.Reports.Queries.GetReport;
using ConnectCampus.Application.Features.Reports.Queries.ListReports;
using ConnectCampus.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers
{
    [Route("api/reports")]
    [ApiController]
    public class ReportsController : ApiController
    {
        private readonly IMediator _mediator;

        public ReportsController(IMediator mediator)
        {
            _mediator = mediator;
        }
        
        /// <summary>
        /// Get a specific report by ID
        /// </summary>
        /// <param name="id">Report ID</param>
        /// <param name="cancellationToken">Cancellation token</param>
        [HttpGet("{id:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetReportQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<ReportDto, IActionResult>(Ok, NotFound);
        }
        
        /// <summary>
        /// Get a list of reports with optional filtering (Admin only)
        /// </summary>
        /// <param name="page">Page number (starting at 1)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <param name="userId">Optional filter by user ID</param>
        /// <param name="status">Optional filter by status</param>
        /// <param name="targetId">Optional filter by target ID</param>
        /// <param name="targetType">Optional filter by target type</param>
        /// <param name="cancellationToken">Cancellation token</param>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ReportDto>>> List(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] Guid? userId = null,
            [FromQuery] ReportStatus? status = null,
            [FromQuery] Guid? targetId = null,
            [FromQuery] string targetType = null,
            CancellationToken cancellationToken = default)
        {
            var query = new ListReportsQuery(page, pageSize, userId, status, targetId, targetType);
            var result = await _mediator.Send(query, cancellationToken);
            
            return Ok(result.Value);
        }
        
        /// <summary>
        /// Get a list of reports for the current user
        /// </summary>
        [HttpGet("user/{userId:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ReportDto>>> GetUserReports(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var query = new ListReportsQuery(page, pageSize, userId);
            var result = await _mediator.Send(query, cancellationToken);
            
            return Ok(result.Value);
        }
        
        /// <summary>
        /// Create a new report
        /// </summary>
        /// <param name="request">Creation request details</param>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Create(CreateReportRequest request)
        {
            var command = new CreateReportCommand(
                request.UserId,
                request.Reason,
                request.Description,
                request.TargetId,
                request.TargetType);
                
            var result = await _mediator.Send(command);
            
            return result.Match(
                id => CreatedAtAction(nameof(Get), new { id }, null),
                failure => HandleFailure(failure));
        }
        
        /// <summary>
        /// Update a report (only for pending reports by the same user)
        /// </summary>
        /// <param name="id">Report ID</param>
        /// <param name="request">Update details</param>
        [HttpPut("{id:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, UpdateReportRequest request)
        {
            var command = new UpdateReportCommand(
                id,
                request.Reason,
                request.Description);
                
            var result = await _mediator.Send(command);
            
            return result.Match(
                success => NoContent(),
                failure => HandleFailure(failure));
        }
        
        /// <summary>
        /// Update the status of a report (Admin only)
        /// </summary>
        /// <param name="id">Report ID</param>
        /// <param name="request">Update details</param>
        [HttpPut("{id:guid}/status")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateStatus(Guid id, UpdateReportStatusRequest request)
        {
            var command = new UpdateReportStatusCommand(id, request.Status);
            var result = await _mediator.Send(command);
            
            return result.Match(
                success => NoContent(),
                failure => HandleFailure(failure));
        }
        
        /// <summary>
        /// Delete a report (only for pending reports by the same user or Admin)
        /// </summary>
        /// <param name="id">Report ID</param>
        [HttpDelete("{id:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var command = new DeleteReportCommand(id);
            var result = await _mediator.Send(command);
            
            return result.Match(
                success => NoContent(),
                failure => HandleFailure(failure));
        }
    }
} 