using System.Net.Mime;
using ConnectCampus.Api.Common;
using ConnectCampus.Api.Common.Attributes;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Application.Features.Users.Queries.GetCurrentUser;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers;

/// <summary>
/// Provides user-related operations
/// </summary>
[ApiController]
[Route("api/users")]
[Produces(MediaTypeNames.Application.Json)]
public class UsersController : ApiController
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets the current authenticated user's information
    /// </summary>
    /// <returns>Current user information</returns>
    [HttpGet("me")]
    [HasRole(Roles.Student, Roles.Association)]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CurrentUserResponse))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var result = await _mediator.Send(new GetCurrentUserQuery());

        return result.Match<CurrentUserResponse, IActionResult>(Ok, () => Ok(null));
    }
} 