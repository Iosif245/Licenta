using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Models.Associations;
using ConnectCampus.Api.Models.Announcements;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Features.Associations.Commands.CreateAssociation;
using ConnectCampus.Application.Features.Associations.Commands.DeleteAssociation;
using ConnectCampus.Application.Features.Associations.Commands.UpdateAssociation;
using ConnectCampus.Application.Features.Associations.Dtos;
using ConnectCampus.Application.Features.Associations.Queries.GetAssociation;
using ConnectCampus.Application.Features.Associations.Queries.ListAssociations;
using ConnectCampus.Application.Features.Announcements.Commands.CreateAnnouncement;
using ConnectCampus.Application.Features.Announcements.Queries.ListAnnouncements;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers
{
    [Route("api/associations")]
    [ApiController]
    public class AssociationsController : ApiController
    {
        private readonly IMediator _mediator;

        public AssociationsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get association by ID
        /// </summary>
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetAssociationQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            return result.Match<AssociationDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get association by slug or ID
        /// </summary>
        [HttpGet("{identifier}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByIdentifier(string identifier, CancellationToken cancellationToken)
        {
            var query = new GetAssociationByIdentifierQuery(identifier);
            var result = await _mediator.Send(query, cancellationToken);
            return result.Match<AssociationDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// List all associations (without pagination for backward compatibility)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> List(CancellationToken cancellationToken)
        {
            var query = new ListAssociationsSimpleQuery();
            var result = await _mediator.Send(query, cancellationToken);
            return result.Match<List<AssociationSummaryDto>, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// List associations with pagination
        /// </summary>
        [HttpGet("paged")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ListPaged(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            CancellationToken cancellationToken = default)
        {
            var paginationParams = new PaginationParams
            {
                PageNumber = page,
                PageSize = pageSize
            };

            var query = new ListAssociationsQuery(paginationParams, category);
            var result = await _mediator.Send(query, cancellationToken);
            return result.Match<object, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Create a new association
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create(CreateAssociationRequest request)
        {
            var command = new CreateAssociationCommand(
                request.UserId,
                request.Name,
                request.Slug,
                request.Description,
                request.Logo,
                request.CoverImage,
                request.Category,
                request.FoundedYear,
                request.Email,
                request.Location,
                request.Website,
                request.Phone,
                request.Address,
                request.Facebook,
                request.Twitter,
                request.Instagram,
                request.LinkedIn,
                request.Tags);

            var result = await _mediator.Send(command);

            return result.Match(
                id => CreatedAtAction(nameof(Get), new { id }, null),
                HandleFailure);
        }

        /// <summary>
        /// Update an existing association
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(Guid id, [FromForm] UpdateAssociationRequest request)
        {
            var command = new UpdateAssociationCommand(
                id,
                request.Name,
                request.Slug,
                request.Description,
                request.Category,
                request.FoundedYear,
                request.Email,
                request.Location,
                request.Website,
                request.Phone,
                request.Address,
                request.Facebook,
                request.Twitter,
                request.Instagram,
                request.LinkedIn,
                request.Tags,
                request.Logo,
                request.CoverImage);

            var result = await _mediator.Send(command);

            return result.Match(NoContent, HandleFailure);
        }

        /// <summary>
        /// Delete an association
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var command = new DeleteAssociationCommand(id);
            var result = await _mediator.Send(command);

            return result.Match(NoContent, HandleFailure);
        }

        // Additional endpoints for the association's relationships

        /// <summary>
        /// List association events
        /// </summary>
        [HttpGet("{id}/events")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ListEvents(Guid id, CancellationToken cancellationToken)
        {
            // This would be implemented with a specific query handler
            // For now, return a placeholder
            return Ok(new { Message = $"List events for association {id}" });
        }

        /// <summary>
        /// List association announcements
        /// </summary>
        [HttpGet("{id}/announcements")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ListAnnouncements(
            Guid id, 
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var query = new ListAnnouncementsQuery(page, pageSize, id, null);
            var result = await _mediator.Send(query, cancellationToken);
            
            return Ok(result.Value);
        }
    }
} 