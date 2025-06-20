namespace ConnectCampus.Infrastructure.SignalR;

public interface INotificationHub
{
    // Methods that will be called from server to client
    Task ReceiveNotification(string message);
    Task ReceiveMessage(object message);
    Task MessagesMarkedAsRead(string chatGroupId);
    Task UnreadCountUpdated(object data);
} 
