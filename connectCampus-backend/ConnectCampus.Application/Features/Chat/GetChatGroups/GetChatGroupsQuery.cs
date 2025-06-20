using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Models;

namespace ConnectCampus.Application.Features.Chat.GetChatGroups;

public record GetChatGroupsQuery(
    int PageNumber = 1,
    int PageSize = 10
) : IQuery<PagedList<ChatGroupDto>>; 