import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, X, Check, Trash2 } from "lucide-react";
import { useNotifications, type Notification } from "@/lib/notificationContext";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  className?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ className }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'candidate':
        return '👤';
      case 'interview':
        return '📅';
      case 'interviewer':
        return '👨‍💼';
      case 'general':
        return '🔔';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'candidate':
        return 'bg-blue-50 border-blue-200';
      case 'interview':
        return 'bg-green-50 border-green-200';
      case 'interviewer':
        return 'bg-purple-50 border-purple-200';
      case 'general':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs px-2 py-1 h-auto"
                  disabled={unreadCount === 0}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs px-2 py-1 h-auto text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear all
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-80 w-full">
          <div className="px-4 pb-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 font-medium">No notifications</p>
                <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={cn(
                        "relative p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                        notification.read 
                          ? "bg-gray-50 border-gray-200 opacity-75" 
                          : getNotificationColor(notification.type),
                        !notification.read && "shadow-sm"
                      )}
                    >
                      {!notification.read && (
                        <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      
                      <div className="flex items-start gap-3 ml-2">
                        <div className="flex-shrink-0 text-lg mt-0.5">
                          {notification.icon || getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={cn(
                                "text-sm font-medium leading-tight",
                                notification.read ? "text-gray-600" : "text-gray-900"
                              )}>
                                {notification.title}
                              </h4>
                              <p className={cn(
                                "text-xs mt-1 leading-relaxed",
                                notification.read ? "text-gray-500" : "text-gray-700"
                              )}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-400">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs px-1.5 py-0.5 h-auto capitalize"
                                >
                                  {notification.type}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="w-6 h-6 p-0 hover:bg-blue-100"
                                  title="Mark as read"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNotification(notification.id)}
                                className="w-6 h-6 p-0 hover:bg-red-100 text-red-500 hover:text-red-600"
                                title="Remove notification"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {index < notifications.length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
