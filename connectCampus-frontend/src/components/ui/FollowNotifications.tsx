import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { ScrollArea } from '@app/components/ui/scroll-area';
import { Bell, UserPlus, Users, Check, Clock, Heart } from 'lucide-react';
import { AppDispatch } from '@app/store';
import { getFollowNotificationsActionAsync, markNotificationReadActionAsync } from '@app/store/actions/follow/follow-async-actions';
import { followNotificationsSelector, followUnreadNotificationsCountSelector } from '@app/store/selectors/follow-selectors';
import { userSelector } from '@app/store/selectors/user-selectors';

interface FollowNotificationsProps {
  className?: string;
  maxHeight?: string;
  showHeader?: boolean;
}

const FollowNotifications: React.FC<FollowNotificationsProps> = ({ className = '', maxHeight = '400px', showHeader = true }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(userSelector);
  const notifications = useSelector(followNotificationsSelector);
  const unreadCount = useSelector(followUnreadNotificationsCountSelector);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user?.id) {
      dispatch(getFollowNotificationsActionAsync(user.id));
    }
  }, [dispatch, user?.id]);

  const handleMarkAsRead = async (notificationId: string) => {
    await dispatch(markNotificationReadActionAsync(notificationId));
    if (user?.id) {
      dispatch(getFollowNotificationsActionAsync(user.id));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_follower':
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'follow_milestone':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'association_followed':
        return <Heart className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'new_follower':
        return `${notification.data?.followerName} started following your association`;
      case 'follow_milestone':
        return `Your association reached ${notification.data?.milestone} followers!`;
      case 'association_followed':
        return `You are now following ${notification.data?.associationName}`;
      default:
        return notification.message || 'New notification';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!mounted || !user?.id) {
    return null;
  }

  return (
    <Card className={`border-0 shadow-sm ${className}`}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5" />
            Follow Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <ScrollArea style={{ maxHeight }}>
          {notifications.length === 0 ? (
            <div className="text-center py-8 px-6">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors border-l-2 ${
                    notification.isRead ? 'border-l-transparent bg-background' : 'border-l-primary bg-primary/5'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-relaxed">{getNotificationMessage(notification)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>

                      {notification.data?.followerAvatar && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={notification.data.followerAvatar} />
                          <AvatarFallback className="text-xs">{notification.data.followerName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {!notification.isRead && (
                      <div className="mt-2">
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} className="h-6 px-2 text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Mark as read
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FollowNotifications;
