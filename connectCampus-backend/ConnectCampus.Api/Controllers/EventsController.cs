using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Models.Events;
using ConnectCampus.Application.Features.Events.Commands.CreateEvent;
using ConnectCampus.Application.Features.Events.Commands.DeleteEvent;
using ConnectCampus.Application.Features.Events.Commands.UpdateEvent;
using ConnectCampus.Application.Features.Events.Commands.RegisterForEvent;
using ConnectCampus.Application.Features.Events.Commands.UnregisterFromEvent;
using ConnectCampus.Application.Features.Events.Commands.AddEventToFavorites;
using ConnectCampus.Application.Features.Events.Commands.RemoveEventFromFavorites;

using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Application.Features.Events.Queries.GetEvent;
using ConnectCampus.Application.Features.Events.Queries.GetEventsByAssociation;
using ConnectCampus.Application.Features.Events.Queries.GetFeaturedEvents;
using ConnectCampus.Application.Features.Events.Queries.GetUpcomingEvents;
using ConnectCampus.Application.Features.Events.Queries.ListEvents;
using ConnectCampus.Application.Features.Events.Queries.GetStudentEventRegistrations;
using ConnectCampus.Application.Features.Events.Queries.GetStudentFavoriteEvents;
using ConnectCampus.Application.Features.Events.Queries.CheckEventRegistrationStatus;
using ConnectCampus.Application.Features.Events.Queries.CheckEventFavoriteStatus;
using ConnectCampus.Application.Features.Events.Queries.GetEventAttendees;
using ConnectCampus.Application.Features.Events.Queries.GetAllEvents;
using ConnectCampus.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventsController : ApiController
    {
        private readonly IMediator _mediator;

        public EventsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get event by ID
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetEventQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<EventDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get event by slug
        /// </summary>
        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetBySlug(string slug, CancellationToken cancellationToken)
        {
            var query = new GetEventBySlugQuery(slug);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<EventDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get a list of events with optional filtering
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> List(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10, 
            [FromQuery] bool? featured = null,
            [FromQuery] bool upcomingOnly = true,
            [FromQuery] string? category = null,
            [FromQuery] EventType? type = null,
            CancellationToken cancellationToken = default)
        {
            var query = new ListEventsQuery(page, pageSize, featured, upcomingOnly, category, type);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<EventSummaryDto>, IActionResult>(Ok, () => Ok(new List<EventSummaryDto>()));
        }

        /// <summary>
        /// Get events by association ID
        /// </summary>
        [HttpGet("association/{associationId}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByAssociation(
            Guid associationId, 
            [FromQuery] bool upcomingOnly = true, 
            CancellationToken cancellationToken = default)
        {
            var query = new GetEventsByAssociationQuery(associationId, upcomingOnly);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<EventSummaryDto>, IActionResult>(Ok, NotFound);
        }
        
        /// <summary>
        /// Get featured events
        /// </summary>
        [HttpGet("featured")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetFeatured(
            [FromQuery] int count = 5,
            CancellationToken cancellationToken = default)
        {
            var query = new GetFeaturedEventsQuery(count);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<EventSummaryDto>, IActionResult>(Ok, () => Ok(new List<EventSummaryDto>()));
        }
        
        /// <summary>
        /// Get upcoming events
        /// </summary>
        [HttpGet("upcoming")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUpcoming(
            [FromQuery] int count = 10,
            CancellationToken cancellationToken = default)
        {
            var query = new GetUpcomingEventsQuery(count);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<EventSummaryDto>, IActionResult>(Ok, () => Ok(new List<EventSummaryDto>()));
        }

        /// <summary>
        /// Get all published events with filtering (no pagination)
        /// </summary>
        [HttpGet("all")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(
            [FromQuery] bool? featured = null,
            [FromQuery] string? category = null,
            [FromQuery] EventType? type = null,
            [FromQuery] string? search = null,
            [FromQuery] string? location = null,
            CancellationToken cancellationToken = default)
        {
            var query = new GetAllEventsQuery(featured, category, type, search, location);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<EventSummaryDto>, IActionResult>(Ok, () => Ok(new List<EventSummaryDto>()));
        }

        /// <summary>
        /// Create a new event
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Create([FromForm] CreateEventRequest request)
        {
            var command = new CreateEventCommand(
                request.AssociationId,
                request.Title,
                request.Description,
                request.CoverImage,
                request.StartDate,
                request.EndDate,
                request.Timezone,
                request.Location,
                request.Category,
                request.Tags,
                request.Capacity,
                request.IsPublic,
                request.IsFeatured,
                request.RegistrationRequired,
                request.RegistrationDeadline,
                request.RegistrationUrl,
                request.Price,
                request.IsFree,
                request.PaymentMethod,
                request.ContactEmail,
                request.Status,
                request.MaxAttendees,
                request.Type
            );
            
            var result = await _mediator.Send(command);
            
            return result.Match(
                id => CreatedAtAction(nameof(Get), new { id }, null),
                HandleFailure
            );
        }
        
        /// <summary>
        /// Update an existing event
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, [FromForm] UpdateEventRequest request)
        {
            var command = new UpdateEventCommand(
                id,
                request.Title,
                request.Description,
                request.StartDate,
                request.EndDate,
                request.Timezone,
                request.Location,
                request.Category,
                request.Tags,
                request.Capacity,
                request.IsPublic,
                request.IsFeatured,
                request.RegistrationRequired,
                request.RegistrationDeadline,
                request.RegistrationUrl,
                request.Price,
                request.IsFree,
                request.PaymentMethod,
                request.ContactEmail,
                request.Status,
                request.MaxAttendees,
                request.Type,
                request.CoverImage
            );
            
            var result = await _mediator.Send(command);
            
            return result.Match(
                _ => NoContent(),
                HandleFailure
            );
        }
        
        /// <summary>
        /// Delete an event
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var command = new DeleteEventCommand(id);
            var result = await _mediator.Send(command);
            
            return result.Match(
                _ => NoContent(),
                HandleFailure
            );
        }

        /// <summary>
        /// Register for an event
        /// </summary>
        [HttpPost("{eventId}/register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RegisterForEvent(Guid eventId, [FromBody] RegisterForEventRequest request)
        {
            var command = new RegisterForEventCommand(request.StudentId, eventId);
            var result = await _mediator.Send(command);
            
            return result.Match(
                id => Created($"/api/events/{eventId}/registrations/{id}", null),
                HandleFailure
            );
        }

        /// <summary>
        /// Unregister from an event
        /// </summary>
        [HttpDelete("{eventId}/register")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UnregisterFromEvent(Guid eventId, [FromBody] UnregisterFromEventRequest request)
        {
            var command = new UnregisterFromEventCommand(request.StudentId, eventId);
            var result = await _mediator.Send(command);
            
            return result.Match(
                _ => NoContent(),
                HandleFailure
            );
        }

        /// <summary>
        /// Add event to favorites
        /// </summary>
        [HttpPost("{eventId}/favorite")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddToFavorites(Guid eventId, [FromBody] AddToFavoritesRequest request)
        {
            var command = new AddEventToFavoritesCommand(request.StudentId, eventId);
            var result = await _mediator.Send(command);
            
            return result.Match(
                id => Created($"/api/events/{eventId}/favorites/{id}", null),
                HandleFailure
            );
        }

        /// <summary>
        /// Remove event from favorites
        /// </summary>
        [HttpDelete("{eventId}/favorite")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveFromFavorites(Guid eventId, [FromBody] RemoveFromFavoritesRequest request)
        {
            var command = new RemoveEventFromFavoritesCommand(request.StudentId, eventId);
            var result = await _mediator.Send(command);
            
            return result.Match(
                _ => NoContent(),
                HandleFailure
            );
        }

        /// <summary>
        /// Get student's event registrations
        /// </summary>
        [HttpGet("registrations/student/{studentId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetStudentRegistrations(
            Guid studentId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var query = new GetStudentEventRegistrationsQuery(studentId, page, pageSize);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<EventRegistrationDto>, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Get student's favorite events
        /// </summary>
        [HttpGet("favorites/student/{studentId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetStudentFavorites(
            Guid studentId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var query = new GetStudentFavoriteEventsQuery(studentId, page, pageSize);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<EventFavoriteDto>, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Check event registration status
        /// </summary>
        [HttpGet("{eventId}/registration-status/{studentId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CheckRegistrationStatus(Guid eventId, Guid studentId, CancellationToken cancellationToken)
        {
            var query = new CheckEventRegistrationStatusQuery(studentId, eventId);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<bool, IActionResult>(
                status => Ok(new { IsRegistered = status }),
                () => Ok(new { IsRegistered = false })
            );
        }

        /// <summary>
        /// Check event favorite status
        /// </summary>
        [HttpGet("{eventId}/favorite-status/{studentId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CheckFavoriteStatus(Guid eventId, Guid studentId, CancellationToken cancellationToken)
        {
            var query = new CheckEventFavoriteStatusQuery(studentId, eventId);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<bool, IActionResult>(
                status => Ok(new { IsFavorite = status }),
                () => Ok(new { IsFavorite = false })
            );
        }

        /// <summary>
        /// Get event attendees
        /// </summary>
        [HttpGet("{eventId}/attendees")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEventAttendees(Guid eventId, CancellationToken cancellationToken)
        {
            var query = new GetEventAttendeesQuery(eventId);
            var result = await _mediator.Send(query, cancellationToken);
            
            return result.Match<List<EventAttendeeDto>, IActionResult>(Ok, NotFound);
        }
    }
} 