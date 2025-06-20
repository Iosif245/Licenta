namespace ConnectCampus.Application.Common.Interfaces;

public interface INotificationHubContext
{
    Task SendNotificationToUserAsync(string userId, string message);
    Task SendNotificationToAllAsync(string message);
    Task NotifyMessageSent(Guid chatGroupId, object message);
    Task NotifyMessagesMarkedAsRead(Guid chatGroupId);
    Task NotifyUnreadCountUpdated(string userId, int unreadCount);
} 