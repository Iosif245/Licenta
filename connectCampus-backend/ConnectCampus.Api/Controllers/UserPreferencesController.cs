using System;
using System.Threading.Tasks;
using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Models.Users;
using ConnectCampus.Application.Features.Users.Commands.UpdateUserPreferences;
using ConnectCampus.Application.Features.Users.Dtos;
using ConnectCampus.Application.Features.Users.Queries.GetUserPreferences;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers
{
    [Route("api/users/{userId:guid}/preferences")]
    [ApiController]
    [Authorize]
    public class UserPreferencesController : ApiController
    {
        private readonly IMediator _mediator;

        public UserPreferencesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get a user's preferences
        /// </summary>
        /// <param name="userId">User ID</param>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPreferences(Guid userId)
        {
            var query = new GetUserPreferencesQuery(userId);
            var result = await _mediator.Send(query);

            return result.Match<UserPreferencesDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Update all user preferences
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="request">User preferences</param>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdatePreferences(
            Guid userId,
            UpdateUserPreferencesRequest request)
        {
            var command = new UpdateUserPreferencesCommand(
                userId,
                request.IsTwoFactorEnabled,
                request.EventRemindersEnabled,
                request.MessageNotificationsEnabled,
                request.AssociationUpdatesEnabled,
                request.MarketingEmailsEnabled,
                request.Theme);

            var result = await _mediator.Send(command);

            return result.Match(
                success => NoContent(),
                failure => HandleFailure(failure));
        }
    }
} 