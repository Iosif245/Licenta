using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Chat.GetChatGroups;

namespace ConnectCampus.Application.Features.Chat.CreateChatGroup;
 
public record CreateChatGroupCommand(
    Guid StudentId,
    Guid AssociationId,
    Guid? EventId = null
) : ICommand<ChatGroupDto>; 