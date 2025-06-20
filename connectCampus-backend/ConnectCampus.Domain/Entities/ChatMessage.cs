using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Entities;

public class ChatMessage : Entity
{
    public Guid ChatGroupId { get; private set; }
    public Guid SenderId { get; private set; }
    public string Content { get; private set; }
    public DateTime SentAt { get; private set; }
    public bool IsRead { get; private set; }

    private ChatMessage() { } // For EF Core

    public ChatMessage(Guid chatGroupId, Guid senderId, string content)
        : base(Guid.NewGuid())
    {
        ChatGroupId = chatGroupId;
        SenderId = senderId;
        Content = content;
        SentAt = DateTime.UtcNow;
        IsRead = false;
    }

    public void MarkAsRead()
    {
        IsRead = true;
    }
} 