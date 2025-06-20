using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Chat.MarkMessagesAsRead;

public record MarkMessagesAsReadCommand(
    Guid ChatGroupId
) : ICommand; 