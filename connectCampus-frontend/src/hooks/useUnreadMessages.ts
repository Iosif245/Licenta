import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@app/store/hooks';
import { authStateSelector, authTokenSelector } from '@app/store/selectors/auth-selectors';
import { userSelector } from '@app/store/selectors/user-selectors';
import { AuthState } from '@app/types/auth/IAuthState';
import { getChatGroupsRequest } from '@app/api/requests/chat-requests';
import { signalRService } from '@app/services/signalr-service';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const authState = useAppSelector(authStateSelector);
  const token = useAppSelector(authTokenSelector);
  const user = useAppSelector(userSelector);
  const location = useLocation();
  
  // Use refs to prevent recreating functions on every render
  const isConnectedRef = useRef(false);

  const fetchUnreadCount = useCallback(async () => {
    if (authState !== AuthState.LoggedIn) {
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await getChatGroupsRequest();
      const totalUnread = response.items.reduce((total, group) => total + group.unreadCount, 0);
      console.log('Fetched unread count:', totalUnread);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Failed to fetch unread messages count:', error);
      // Don't reset to 0 on network errors, keep current count
      if (error instanceof TypeError || (error as any)?.code === 'NETWORK_ERROR') {
        console.log('Network error detected, keeping current unread count');
        return;
      }
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [authState]);

  // Setup SignalR connection and event listeners
  useEffect(() => {
    if (token && authState === AuthState.LoggedIn && !isConnectedRef.current) {
      const setupConnections = async () => {
        try {
          console.log('Setting up SignalR connections for unread messages...');
          
          // Setup both connections
          const [chatConnection, notificationConnection] = await Promise.all([
            signalRService.getChatConnection(token),
            signalRService.getNotificationConnection(token)
          ]);
          
          // Chat connection for real-time message updates
          if (chatConnection) {
            console.log('Chat SignalR connected for unread messages');
            
            // Listen for incoming messages to update unread count
            chatConnection.on('ReceiveMessage', (message) => {
              console.log('Received message in unread hook:', message);
              console.log('Current user ID:', user?.id);
              console.log('Message sender ID:', message.senderId);
              console.log('Current location:', location.pathname);
              
              const currentUserId = user?.id?.toString();
              const messageSenderId = message.senderId?.toString();
              
              console.log('Current user ID (string):', currentUserId);
              console.log('Message sender ID (string):', messageSenderId);
              console.log('User IDs match:', messageSenderId === currentUserId);
              
              // Only increment if it's not from current user AND user is not on messages page
              const isOnMessagesPage = location.pathname === '/messages';
              
              if (messageSenderId !== currentUserId) {
                if (isOnMessagesPage) {
                  console.log('User is on messages page, not incrementing unread count');
                } else {
                  console.log('Incrementing unread count for message from:', messageSenderId);
                  setUnreadCount(prev => {
                    const newCount = prev + 1;
                    console.log('Unread count updated from', prev, 'to', newCount);
                    return newCount;
                  });
                }
              } else {
                console.log('Not incrementing - message is from current user');
              }
            });
          }

          // Notification connection for global events
          if (notificationConnection) {
            console.log('Notification SignalR connected for unread messages');
            
            // Listen for messages marked as read
            notificationConnection.on('MessagesMarkedAsRead', (data) => {
              console.log('Messages marked as read:', data);
              // Refetch to get accurate count
              fetchUnreadCount();
            });

            // Listen for chat group updates
            notificationConnection.on('ChatGroupUpdated', (data) => {
              console.log('Chat group updated:', data);
              fetchUnreadCount();
            });

            // Listen for unread count updates
            notificationConnection.on('UnreadCountUpdated', (data) => {
              console.log('Unread count updated via SignalR:', data);
              if (data.userId === user?.id) {
                console.log('Setting unread count to:', data.unreadCount);
                setUnreadCount(data.unreadCount);
              }
            });
          }
          
          isConnectedRef.current = true;
        } catch (error) {
          console.error('Failed to setup SignalR connections:', error);
        }
      };

      setupConnections();

      return () => {
        // Clean up event listeners when component unmounts or dependencies change
        console.log('Cleaning up SignalR event listeners...');
        Promise.all([
          signalRService.getChatConnection(token),
          signalRService.getNotificationConnection(token)
        ]).then(([chatConnection, notificationConnection]) => {
          if (chatConnection) {
            chatConnection.off('ReceiveMessage');
          }
          if (notificationConnection) {
            notificationConnection.off('MessagesMarkedAsRead');
            notificationConnection.off('ChatGroupUpdated');
            notificationConnection.off('UnreadCountUpdated');
          }
        }).catch(console.error);
        
        isConnectedRef.current = false;
      };
    } else if (authState !== AuthState.LoggedIn) {
      // Clear unread count if not logged in
      setUnreadCount(0);
      isConnectedRef.current = false;
    }
  }, [token, authState, user?.id, location.pathname]); // Added location.pathname to dependencies

  // Initial fetch and periodic updates
  useEffect(() => {
    if (authState === AuthState.LoggedIn) {
      fetchUnreadCount();
      
      // Fetch every 60 seconds as backup (reduced from 30s since we have real-time updates)
      const interval = setInterval(fetchUnreadCount, 60000);
      
      return () => clearInterval(interval);
    }
  }, [fetchUnreadCount, authState]);

  return { unreadCount, loading, refetch: fetchUnreadCount };
}; 