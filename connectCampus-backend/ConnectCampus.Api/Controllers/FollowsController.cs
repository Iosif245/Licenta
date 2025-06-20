using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Models.Follows;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Features.Associations.Dtos;
using ConnectCampus.Application.Features.Follows.Commands.CreateFollow;
using ConnectCampus.Application.Features.Follows.Commands.DeleteFollow;
using ConnectCampus.Application.Features.Follows.Dtos;
using ConnectCampus.Application.Features.Follows.Queries.GetFollowedAssociations;
using ConnectCampus.Application.Features.Follows.Queries.GetFollowers;
using ConnectCampus.Application.Features.Follows.Queries.CheckFollow;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers
{
    [Route("api/follows")]
    [ApiController]
    public class FollowsController : ApiController
    {
        private readonly IMediator _mediator;

        public FollowsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get followers of an association (without pagination)
        /// </summary>
        [HttpGet("associations/{associationId}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAssociationFollowers(Guid associationId, CancellationToken cancellationToken)
        {
            var query = new GetFollowersQuery(associationId);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<FollowDto>, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get followers of an association with pagination
        /// </summary>
        [HttpGet("associations/{associationId}/paged")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAssociationFollowersPaged(
            Guid associationId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var paginationParams = new PaginationParams
            {
                PageNumber = page,
                PageSize = pageSize
            };

            var query = new GetFollowersPagedQuery(associationId, paginationParams);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<PagedFollowersDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get associations followed by a student (without pagination)
        /// </summary>
        [HttpGet("students/{studentId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetStudentFollows(Guid studentId, CancellationToken cancellationToken)
        {
            var query = new GetFollowedAssociationsQuery(studentId);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<AssociationSummaryDto>, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get associations followed by a student with pagination
        /// </summary>
        [HttpGet("students/{studentId}/paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetStudentFollowsPaged(
            Guid studentId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var paginationParams = new PaginationParams
            {
                PageNumber = page,
                PageSize = pageSize
            };

            var query = new GetFollowedAssociationsPagedQuery(studentId, paginationParams);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<PagedFollowedAssociationsDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Check if student follows an association
        /// </summary>
        [HttpGet("associations/{associationId}/students/{studentId}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CheckFollow(Guid associationId, Guid studentId, CancellationToken cancellationToken)
        {
            var query = new CheckFollowQuery(studentId, associationId);
            var result = await _mediator.Send(query, cancellationToken);
            
            if (result.HasValue)
            {
                return result.Value ? NoContent() : NotFound();
            }
            
            return NotFound(); // Default to not found if query fails
        }

        /// <summary>
        /// Follow an association
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Follow([FromBody] CreateFollowRequest request)
        {
            var command = new CreateFollowCommand(request.StudentId, request.AssociationId);
            var result = await _mediator.Send(command);
            
            return result.Match(
                _ => NoContent(),
                HandleFailure);
        }

        /// <summary>
        /// Unfollow an association
        /// </summary>
        [HttpDelete("associations/{associationId}/students/{studentId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Unfollow(Guid associationId, Guid studentId)
        {
            var command = new DeleteFollowCommand(studentId, associationId);
            var result = await _mediator.Send(command);
            
            return result.Match(
                _ => NoContent(),
                HandleFailure);
        }
    }
} 