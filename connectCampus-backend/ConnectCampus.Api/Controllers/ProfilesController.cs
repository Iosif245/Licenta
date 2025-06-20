using System.Net.Mime;
using ConnectCampus.Api.Common;
using ConnectCampus.Api.Common.Attributes;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Application.Features.Profiles.Queries.GetCurrentUserProfile;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers;

/// <summary>
/// Provides profile-related operations
/// </summary>
[ApiController]
[Route("api/profiles")]
[Produces(MediaTypeNames.Application.Json)]
public class ProfilesController : ApiController
{
    private readonly IMediator _mediator;

    public ProfilesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets the current authenticated user's profile information
    /// </summary>
    /// <returns>Current user profile information based on role (Student or Association)</returns>
    [HttpGet("me")]
    [HasRole(Roles.Student, Roles.Association)]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CurrentUserProfileResponse))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentUserProfile()
    {
        var query = new GetCurrentUserProfileQuery();
        var result = await _mediator.Send(query);

        return result.Match<CurrentUserProfileResponse, IActionResult>(Ok, NotFound);
    }
} 