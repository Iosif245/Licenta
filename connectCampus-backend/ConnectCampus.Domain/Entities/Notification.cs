using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Entities;

public class Notification : Entity
{
    public Guid UserId { get; private set; }
    public string Title { get; private set; }
    public string Message { get; private set; }
    public bool IsRead { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public string? Link { get; private set; }

    private Notification() { } // For EF Core

    public Notification(Guid userId, string title, string message, string? link = null)
        : base(Guid.NewGuid())
    {
        UserId = userId;
        Title = title;
        Message = message;
        IsRead = false;
        CreatedAt = DateTime.UtcNow;
        Link = link;
    }

    public void MarkAsRead()
    {
        IsRead = true;
    }
} 