namespace ConnectCampus.Application.Features.Chat.GetMessages;

public class ChatMessageDto
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }
    public bool IsFromCurrentUser { get; set; }
    
    // Sender profile information
    public string SenderName { get; set; } = string.Empty;
    public string? SenderAvatarUrl { get; set; }
    public string SenderType { get; set; } = string.Empty; // "Student" or "Association"
} 