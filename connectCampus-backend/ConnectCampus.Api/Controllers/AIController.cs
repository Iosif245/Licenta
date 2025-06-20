using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Models.AI;
using ConnectCampus.Application.Features.AI.Commands.ImproveContent;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers;

[Route("api/ai")]
[ApiController]
[Authorize]
public class AIController : ApiController
{
    private readonly IMediator _mediator;

    public AIController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Improve content using AI
    /// </summary>
    /// <param name="request">The content improvement request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The improved content with suggestions</returns>
    [HttpPost("improve-content")]
    [ProducesResponseType(typeof(ImproveContentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ImproveContent(
        [FromBody] ImproveContentRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ImproveContentCommand(
            request.Content,
            request.Type);

        var result = await _mediator.Send(command, cancellationToken);

        return result.Match(
            success => Ok(new ImproveContentResponse
            {
                ImprovedContent = success.ImprovedContent,
                Suggestions = success.Suggestions.Select(s => new ImprovementSuggestionResponse
                {
                    Type = s.Type,
                    Description = s.Description
                }).ToList()
            }),
            HandleFailure);
    }
} 