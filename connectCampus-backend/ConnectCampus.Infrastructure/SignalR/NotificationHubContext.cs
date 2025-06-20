using Microsoft.AspNetCore.SignalR;
using ConnectCampus.Application.Common.Interfaces;

namespace ConnectCampus.Infrastructure.SignalR;

public class NotificationHubContext : INotificationHubContext
{
    private readonly IHubContext<NotificationHub, INotificationHub> _hubContext;

    public NotificationHubContext(IHubContext<NotificationHub, INotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationToUserAsync(string userId, string message)
    {
        await _hubContext.Clients.Group($"user_{userId}").ReceiveNotification(message);
    }

    public async Task SendNotificationToAllAsync(string message)
    {
        await _hubContext.Clients.All.ReceiveNotification(message);
    }

    public async Task NotifyMessageSent(Guid chatGroupId, object message)
    {
        await _hubContext.Clients.Group($"chat_{chatGroupId}").ReceiveMessage(message);
    }

    public async Task NotifyMessagesMarkedAsRead(Guid chatGroupId)
    {
        await _hubContext.Clients.Group($"chat_{chatGroupId}").MessagesMarkedAsRead(chatGroupId.ToString());
    }

    public async Task NotifyUnreadCountUpdated(string userId, int unreadCount)
    {
        Console.WriteLine($"[NotificationHub] Sending unread count update to user {userId}: {unreadCount}");
        await _hubContext.Clients.Group($"user_{userId}").UnreadCountUpdated(new { userId, unreadCount });
        Console.WriteLine($"[NotificationHub] Unread count update sent successfully");
    }
} 