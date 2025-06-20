using ConnectCampus.Application.Features.Chat.GetChatGroups;

namespace ConnectCampus.Application.Features.Chat.GetChatGroups;

public record GetChatGroupsResponse(
    Guid Id,
    Guid StudentId,
    Guid AssociationId,
    DateTime CreatedAt,
    Guid? LastMessageId,
    int UnreadCount,
    string LastMessageContent,
    DateTime LastMessageSentAt
); 