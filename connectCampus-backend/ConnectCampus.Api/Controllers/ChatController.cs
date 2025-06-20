using MediatR;
using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Features.Chat.GetChatGroups;
using ConnectCampus.Application.Features.Chat.GetMessages;
using ConnectCampus.Application.Features.Chat.SendMessage;
using ConnectCampus.Application.Features.Chat.CreateChatGroup;
using ConnectCampus.Application.Features.Chat.MarkMessagesAsRead;
using Microsoft.AspNetCore.Mvc;
using GetMessageDto = ConnectCampus.Application.Features.Chat.GetMessages.ChatMessageDto;
using SendMessageDto = ConnectCampus.Application.Features.Chat.SendMessage.ChatMessageDto;

namespace ConnectCampus.Api.Controllers;

[Route("api/[controller]")]
public class ChatController : ApiController
{
    private readonly IMediator _mediator;

    public ChatController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("groups")]
    public async Task<IActionResult> GetChatGroups(CancellationToken cancellationToken)
    {
        var query = new GetChatGroupsQuery();
        var maybe = await _mediator.Send(query, cancellationToken);

        return maybe.Match(
            success => Ok(success),
            () => Ok(new PagedList<ChatGroupDto>(new List<ChatGroupDto>(), query.PageNumber, query.PageSize, 0))
        );
    }

    [HttpGet("groups/{chatGroupId}/messages")]
    public async Task<IActionResult> GetMessages(
        [FromRoute] Guid chatGroupId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetMessagesQuery(chatGroupId, pageNumber, pageSize);
        var maybe = await _mediator.Send(query, cancellationToken);

        return maybe.Match(
            success => Ok(success),
            () => Ok(new PagedList<GetMessageDto>(new List<GetMessageDto>(), query.PageNumber, query.PageSize, 0))
        );
    }

    [HttpPost("groups/{chatGroupId}/messages")]
    public async Task<IActionResult> SendMessage([FromRoute] Guid chatGroupId, [FromBody] MessageRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new SendMessageCommand(chatGroupId, request.Message), cancellationToken);

        return result.Match(
            success => Ok(success),
            HandleFailure);
    }

    [HttpPost("groups")]
    public async Task<IActionResult> CreateOrGetChatGroup([FromBody] CreateChatGroupRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateChatGroupCommand(request.StudentId, request.AssociationId, request.EventId);
        var result = await _mediator.Send(command, cancellationToken);

        return result.Match(
            success => Ok(success),
            HandleFailure);
    }

    [HttpPatch("groups/{chatGroupId}/mark-read")]
    public async Task<IActionResult> MarkMessagesAsRead([FromRoute] Guid chatGroupId, CancellationToken cancellationToken)
    {
        var command = new MarkMessagesAsReadCommand(chatGroupId);
        var result = await _mediator.Send(command, cancellationToken);

        return result.Match(
            () => NoContent(),
            HandleFailure);
    }
} 

public record MessageRequest(string Message);
public record CreateChatGroupRequest(Guid StudentId, Guid AssociationId, Guid? EventId = null);