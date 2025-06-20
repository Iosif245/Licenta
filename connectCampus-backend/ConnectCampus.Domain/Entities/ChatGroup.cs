using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Domain.Entities;

public class ChatGroup : Entity
{
    public Guid StudentId { get; private set; }
    public Guid AssociationId { get; private set; }
    public Guid? EventId { get; private set; } // Optional: for event-specific chats
    public DateTime CreatedAt { get; private set; }
    public DateTime? LastMessageAt { get; private set; }
    
    public virtual ICollection<ChatMessage> Messages { get; private set; } = new List<ChatMessage>();
    
    // Navigation properties
    public virtual Student? Student { get; private set; }
    public virtual Association? Association { get; private set; }
    
    // Keep the private collection for domain logic
    private List<ChatMessage> _messages => Messages.ToList();

    private ChatGroup() { } // For EF Core

    public ChatGroup(Guid studentId, Guid associationId, Guid? eventId = null)
        : base(Guid.NewGuid())
    {
        StudentId = studentId;
        AssociationId = associationId;
        EventId = eventId;
        CreatedAt = DateTime.UtcNow;
    }

    public void AddMessage(Guid senderId, string content)
    {
        var message = new ChatMessage(Id, senderId, content);
        Messages.Add(message);
        LastMessageAt = DateTime.UtcNow;
    }
        
    public void UpdateLastMessageTime()
    {
        LastMessageAt = DateTime.UtcNow;
    }

    public bool HasUnreadMessages(Guid userId)
    {
        return Messages.Any(m => !m.IsRead && m.SenderId != userId);
    }

    public void MarkMessagesAsRead(Guid userId)
    {
        var unreadMessages = Messages.Where(m => !m.IsRead && m.SenderId != userId);
        foreach (var message in unreadMessages)
        {
            message.MarkAsRead();
        }
    }

    public Guid GetOtherUserId(Guid userId)
    {
        return userId == StudentId ? AssociationId : StudentId;
    }

    public bool IsMember(Guid userId)
    {
        return userId == StudentId || userId == AssociationId;
    }
} 