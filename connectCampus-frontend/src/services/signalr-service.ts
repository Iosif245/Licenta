import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import Config from '@app/config/config';

class SignalRService {
  private chatConnection: HubConnection | null = null;
  private notificationConnection: HubConnection | null = null;
  private chatConnectionPromise: Promise<void> | null = null;
  private notificationConnectionPromise: Promise<void> | null = null;
  private isConnectingChat = false;
  private isConnectingNotification = false;
  private chatReconnectAttempts = 0;
  private notificationReconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Chat Hub Connection (for specific chat messages)
  async getChatConnection(token: string): Promise<HubConnection | null> {
    if (!token) {
      return null;
    }

    // If we already have a connected connection, return it
    if (this.chatConnection && this.chatConnection.state === HubConnectionState.Connected) {
      return this.chatConnection;
    }

    // If we're already connecting, wait for that to complete
    if (this.isConnectingChat && this.chatConnectionPromise) {
      await this.chatConnectionPromise;
      return this.chatConnection;
    }

    // Create new connection
    this.isConnectingChat = true;
    
    try {
      // Stop existing connection if any
      if (this.chatConnection) {
        await this.chatConnection.stop();
      }

      this.chatConnection = new HubConnectionBuilder()
        .withUrl(`${Config.api.apiUrl}/hubs/chat`, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .build();

      // Start the connection
      this.chatConnectionPromise = this.chatConnection.start();
      await this.chatConnectionPromise;

      console.log('SignalR Chat connection established');
      this.chatReconnectAttempts = 0;
      
      // Handle connection close
      this.chatConnection.onclose((error) => {
        console.log('SignalR Chat connection closed', error);
        this.chatConnection = null;
        this.chatConnectionPromise = null;
        this.isConnectingChat = false;
        
        // Auto-reconnect if not too many attempts
        if (this.chatReconnectAttempts < this.maxReconnectAttempts) {
          this.chatReconnectAttempts++;
          console.log(`Attempting to reconnect chat connection (attempt ${this.chatReconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.getChatConnection(token), 2000 * this.chatReconnectAttempts);
        }
      });

      this.chatConnection.onreconnected(() => {
        console.log('SignalR Chat connection reconnected');
        this.chatReconnectAttempts = 0;
      });

      return this.chatConnection;
    } catch (error) {
      console.error('SignalR Chat connection error:', error);
      this.chatConnection = null;
      this.chatConnectionPromise = null;
      return null;
    } finally {
      this.isConnectingChat = false;
    }
  }

  // Notification Hub Connection (for global notifications like unread count)
  async getNotificationConnection(token: string): Promise<HubConnection | null> {
    if (!token) {
      return null;
    }

    // If we already have a connected connection, return it
    if (this.notificationConnection && this.notificationConnection.state === HubConnectionState.Connected) {
      return this.notificationConnection;
    }

    // If we're already connecting, wait for that to complete
    if (this.isConnectingNotification && this.notificationConnectionPromise) {
      await this.notificationConnectionPromise;
      return this.notificationConnection;
    }

    // Create new connection
    this.isConnectingNotification = true;
    
    try {
      // Stop existing connection if any
      if (this.notificationConnection) {
        await this.notificationConnection.stop();
      }

      this.notificationConnection = new HubConnectionBuilder()
        .withUrl(`${Config.api.apiUrl}/hubs/notifications`, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .build();

      // Start the connection
      this.notificationConnectionPromise = this.notificationConnection.start();
      await this.notificationConnectionPromise;

      console.log('SignalR Notification connection established');
      this.notificationReconnectAttempts = 0;
      
      // Handle connection close
      this.notificationConnection.onclose((error) => {
        console.log('SignalR Notification connection closed', error);
        this.notificationConnection = null;
        this.notificationConnectionPromise = null;
        this.isConnectingNotification = false;
        
        // Auto-reconnect if not too many attempts
        if (this.notificationReconnectAttempts < this.maxReconnectAttempts) {
          this.notificationReconnectAttempts++;
          console.log(`Attempting to reconnect notification connection (attempt ${this.notificationReconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.getNotificationConnection(token), 2000 * this.notificationReconnectAttempts);
        }
      });

      this.notificationConnection.onreconnected(() => {
        console.log('SignalR Notification connection reconnected');
        this.notificationReconnectAttempts = 0;
      });

      return this.notificationConnection;
    } catch (error) {
      console.error('SignalR Notification connection error:', error);
      this.notificationConnection = null;
      this.notificationConnectionPromise = null;
      return null;
    } finally {
      this.isConnectingNotification = false;
    }
  }

  // Legacy method for backward compatibility - returns chat connection
  async getConnection(token: string): Promise<HubConnection | null> {
    return this.getChatConnection(token);
  }

  async joinChat(chatGroupId: string, token?: string): Promise<void> {
    const connection = await this.getChatConnection(token || '');
    if (connection && connection.state === HubConnectionState.Connected) {
      try {
        await connection.invoke('JoinChat', chatGroupId);
      } catch (error) {
        console.error('Error joining chat:', error);
      }
    }
  }

  async leaveChat(chatGroupId: string): Promise<void> {
    if (this.chatConnection && this.chatConnection.state === HubConnectionState.Connected) {
      try {
        await this.chatConnection.invoke('LeaveChat', chatGroupId);
      } catch (error) {
        console.error('Error leaving chat:', error);
      }
    }
  }

  async sendMessage(chatGroupId: string, content: string): Promise<void> {
    if (this.chatConnection && this.chatConnection.state === HubConnectionState.Connected) {
      try {
        await this.chatConnection.invoke('SendMessage', chatGroupId, content);
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    } else {
      throw new Error('SignalR chat connection not available');
    }
  }

  async disconnect(): Promise<void> {
    const promises: Promise<void>[] = [];
    
    if (this.chatConnection) {
      promises.push(this.chatConnection.stop());
      this.chatConnection = null;
      this.chatConnectionPromise = null;
      this.isConnectingChat = false;
    }
    
    if (this.notificationConnection) {
      promises.push(this.notificationConnection.stop());
      this.notificationConnection = null;
      this.notificationConnectionPromise = null;
      this.isConnectingNotification = false;
    }
    
    await Promise.all(promises);
  }

  isConnected(): boolean {
    return this.chatConnection?.state === HubConnectionState.Connected || 
           this.notificationConnection?.state === HubConnectionState.Connected;
  }

  isChatConnected(): boolean {
    return this.chatConnection?.state === HubConnectionState.Connected;
  }

  isNotificationConnected(): boolean {
    return this.notificationConnection?.state === HubConnectionState.Connected;
  }
}

// Export singleton instance
export const signalRService = new SignalRService(); 