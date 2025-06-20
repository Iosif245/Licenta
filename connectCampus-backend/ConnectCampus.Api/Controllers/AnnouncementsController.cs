using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Models.Announcements;
using ConnectCampus.Application.Features.Announcements.Commands.CreateAnnouncement;
using ConnectCampus.Application.Features.Announcements.Commands.DeleteAnnouncement;
using ConnectCampus.Application.Features.Announcements.Commands.UpdateAnnouncement;
using ConnectCampus.Application.Features.Announcements.Commands.LikeAnnouncement;
using ConnectCampus.Application.Features.Announcements.Commands.AddComment;
using ConnectCampus.Application.Features.Announcements.Commands.UpdateComment;
using ConnectCampus.Application.Features.Announcements.Commands.DeleteComment;
using ConnectCampus.Application.Features.Announcements.Dtos;
using ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncement;
using ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementWithInteractions;
using ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementComments;
using ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementLikes;
using ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementStatistics;
using ConnectCampus.Application.Features.Announcements.Queries.ListAnnouncements;
using ConnectCampus.Application.Features.Announcements.Queries.ListAnnouncementsWithInteractions;
using ConnectCampus.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers
{
    [Route("api/announcements")]
    [ApiController]
    public class AnnouncementsController : ApiController
    {
        private readonly IMediator _mediator;

        public AnnouncementsController(IMediator mediator)
        {
            _mediator = mediator;
        }
        
        /// <summary>
        /// Get a specific announcement by ID
        /// </summary>
        /// <param name="id">Announcement ID</param>
        /// <param name="cancellationToken">Cancellation token</param>
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetAnnouncementQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<AnnouncementDto, IActionResult>(Ok, NotFound);
        }
        
        /// <summary>
        /// Get a list of announcements with optional filtering
        /// </summary>
        /// <param name="page">Page number (starting at 1)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <param name="associationId">Optional filter by association ID</param>
        /// <param name="eventId">Optional filter by event ID</param>
        /// <param name="cancellationToken">Cancellation token</param>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<AnnouncementSummaryDto>>> List(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] Guid? associationId = null,
            [FromQuery] Guid? eventId = null,
            CancellationToken cancellationToken = default)
        {
            var query = new ListAnnouncementsQuery(page, pageSize, associationId, eventId);
            var result = await _mediator.Send(query, cancellationToken);
            
            return Ok(result.Value);
        }

        /// <summary>
        /// Get a list of announcements with interaction counts
        /// </summary>
        /// <param name="page">Page number (starting at 1)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <param name="associationId">Optional filter by association ID</param>
        /// <param name="eventId">Optional filter by event ID</param>
        /// <param name="userId">Optional user ID to check like status</param>
        /// <param name="userType">Optional user type (Student or Association)</param>
        /// <param name="cancellationToken">Cancellation token</param>
        [HttpGet("with-interactions")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ListWithInteractions(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] Guid? associationId = null,
            [FromQuery] Guid? eventId = null,
            [FromQuery] Guid? userId = null,
            [FromQuery] string? userType = null,
            CancellationToken cancellationToken = default)
        {
            // Convert userType string to enum if provided
            AuthorType? authorType = null;
            if (!string.IsNullOrEmpty(userType))
            {
                authorType = AuthorType.FromName(userType);
                if (authorType == null)
                {
                    return BadRequest($"Invalid UserType: {userType}. Must be 'Student' or 'Association'.");
                }
            }

            var query = new ListAnnouncementsWithInteractionsQuery(page, pageSize, associationId, eventId, userId, authorType);
            var result = await _mediator.Send(query, cancellationToken);
            
            return Ok(result.Value);
        }
        
        /// <summary>
        /// Create a new announcement
        /// </summary>
        /// <param name="request">Creation request details</param>
        [HttpPost]
        [Authorize(Roles = "Admin,Association")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Create([FromForm] CreateAnnouncementRequest request)
        {
            var command = new CreateAnnouncementCommand(
                request.AssociationId,
                request.Title,
                request.Content,
                request.Image,
                request.EventId);
                
            var result = await _mediator.Send(command);
            
            return result.Match(
                id => CreatedAtAction(nameof(Get), new { id }, null),
                failure => HandleFailure(failure));
        }
        
        /// <summary>
        /// Update an existing announcement
        /// </summary>
        /// <param name="id">Announcement ID to update</param>
        /// <param name="request">Update details</param>
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,Association")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, [FromForm] UpdateAnnouncementRequest request)
        {
            var command = new UpdateAnnouncementCommand(
                id,
                request.Title,
                request.Content,
                request.Image);
                
            var result = await _mediator.Send(command);
            
            return result.Match(
                success => NoContent(),
                failure => HandleFailure(failure));
        }
        
        /// <summary>
        /// Delete an announcement
        /// </summary>
        /// <param name="id">Announcement ID to delete</param>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin,Association")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var command = new DeleteAnnouncementCommand(id);
            var result = await _mediator.Send(command);
            
            return result.Match(
                success => NoContent(),
                failure => HandleFailure(failure));
        }

        /// <summary>
        /// Like or unlike an announcement
        /// </summary>
        /// <param name="id">Announcement ID</param>
        /// <param name="request">Like request details</param>
        [HttpPost("{id:guid}/like")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> LikeAnnouncement(Guid id, LikeAnnouncementRequest request)
        {
            // Validate and convert AuthorType string to enum
            var authorType = AuthorType.FromName(request.AuthorType);
            if (authorType == null)
            {
                return BadRequest($"Invalid AuthorType: {request.AuthorType}. Must be 'Student' or 'Association'.");
            }

            var command = new LikeAnnouncementCommand(
                id,
                request.AuthorId,
                authorType);
                
            var result = await _mediator.Send(command);
            
            return result.Match(
                liked => Ok(new { liked }),
                failure => HandleFailure(failure));
        }

        /// <summary>
        /// Add a comment to an announcement
        /// </summary>
        /// <param name="id">Announcement ID</param>
        /// <param name="request">Comment details</param>
        [HttpPost("{id:guid}/comments")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddComment(Guid id, AddCommentRequest request)
        {
            // Validate and convert AuthorType string to enum
            var authorType = AuthorType.FromName(request.AuthorType);
            if (authorType == null)
            {
                return BadRequest($"Invalid AuthorType: {request.AuthorType}. Must be 'Student' or 'Association'.");
            }

            var command = new AddCommentCommand(
                id,
                request.AuthorId,
                authorType,
                request.Content,
                request.ParentCommentId);
                
            var result = await _mediator.Send(command);
            
            return result.Match(
                commentId => Created($"/api/announcements/{id}/comments/{commentId}", new { id = commentId }),
                failure => HandleFailure(failure));
        }

        /// <summary>
        /// Get comments for an announcement
        /// </summary>
        /// <param name="id">Announcement ID</param>
        /// <param name="cancellationToken">Cancellation token</param>
        [HttpGet("{id:guid}/comments")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetComments(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetAnnouncementCommentsQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<AnnouncementCommentDto>, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get likes for an announcement
        /// </summary>
        /// <param name="id">Announcement ID</param>
        /// <param name="cancellationToken">Cancellation token</param>
        [HttpGet("{id:guid}/likes")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetLikes(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetAnnouncementLikesQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<AnnouncementLikeDto>, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get announcement with interaction counts and user's like status
        /// </summary>
        /// <param name="id">Announcement ID</param>
        /// <param name="userId">Optional user ID to check like status</param>
        /// <param name="userType">Optional user type to check like status ("Student" or "Association")</param>
        /// <param name="cancellationToken">Cancellation token</param>
        [HttpGet("{id:guid}/interactions")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetWithInteractions(
            Guid id, 
            [FromQuery] Guid? userId = null,
            [FromQuery] string? userType = null,
            CancellationToken cancellationToken = default)
        {
            AuthorType? authorType = null;
            if (!string.IsNullOrEmpty(userType))
            {
                authorType = AuthorType.FromName(userType);
                if (authorType == null)
                {
                    return BadRequest($"Invalid userType: {userType}. Must be 'Student' or 'Association'.");
                }
            }

            var query = new GetAnnouncementWithInteractionsQuery(id, userId, authorType);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<AnnouncementWithInteractionsDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get comprehensive statistics for an announcement
        /// </summary>
        /// <param name="id">Announcement ID</param>
        /// <param name="cancellationToken">Cancellation token</param>
        [HttpGet("{id:guid}/statistics")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetStatistics(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetAnnouncementStatisticsQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<AnnouncementStatisticsDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Update a comment
        /// </summary>
        /// <param name="id">Announcement ID</param>
        /// <param name="commentId">Comment ID</param>
        /// <param name="request">Update details</param>
        [HttpPut("{id:guid}/comments/{commentId:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateComment(Guid id, Guid commentId, UpdateCommentRequest request)
        {
            var command = new UpdateCommentCommand(commentId, request.Content);
            var result = await _mediator.Send(command);
            
            return result.Match(
                success => NoContent(),
                failure => HandleFailure(failure));
        }

        /// <summary>
        /// Delete a comment
        /// </summary>
        /// <param name="id">Announcement ID</param>
        /// <param name="commentId">Comment ID</param>
        [HttpDelete("{id:guid}/comments/{commentId:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteComment(Guid id, Guid commentId)
        {
            var command = new DeleteCommentCommand(commentId);
            var result = await _mediator.Send(command);
            
            return result.Match(
                success => NoContent(),
                failure => HandleFailure(failure));
        }
    }
} 