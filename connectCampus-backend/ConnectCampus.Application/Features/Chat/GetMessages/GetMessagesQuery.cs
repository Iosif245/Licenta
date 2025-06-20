using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Features.Chat.SendMessage;

namespace ConnectCampus.Application.Features.Chat.GetMessages;

public record GetMessagesQuery(
    Guid ChatGroupId,
    int PageNumber = 1,
    int PageSize = 20
) : IQuery<PagedList<ChatMessageDto>>; 