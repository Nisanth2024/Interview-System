import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications as clearAllNotificationsAPI
} from './notificationApi';

export interface Notification {
  id: string;
  _id?: string;
  title: string;
  message: string;
  type: 'candidate' | 'interview' | 'interviewer' | 'general';
  read: boolean;
  timestamp: Date;
  createdAt?: string;
  updatedAt?: string;
  icon?: string;
  userId?: string;
  relatedId?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  clearUserData: () => void;
  initializeForUser: (userId?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Transform backend notification to frontend format
  const transformNotification = (backendNotification: any): Notification => ({
    id: backendNotification._id || backendNotification.id,
    _id: backendNotification._id,
    title: backendNotification.title,
    message: backendNotification.message,
    type: backendNotification.type,
    read: backendNotification.read,
    timestamp: new Date(backendNotification.createdAt || backendNotification.timestamp),
    createdAt: backendNotification.createdAt,
    updatedAt: backendNotification.updatedAt,
    icon: backendNotification.icon,
    userId: backendNotification.userId,
    relatedId: backendNotification.relatedId,
    priority: backendNotification.priority
  });

  // Fetch notifications from backend for current user
  const refreshNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getNotifications({ 
        limit: 50,
        userId: currentUserId || undefined
      });
      const transformedNotifications = response.notifications.map(transformNotification);
      setNotifications(transformedNotifications);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback to empty state on error
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Initialize user data and load notifications
  const initializeForUser = useCallback(async (userId?: string) => {
    setCurrentUserId(userId || null);
    await refreshNotifications();
  }, [refreshNotifications]);

  // Clear user-specific data on logout
  const clearUserData = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setCurrentUserId(null);
    setLoading(false);
  }, []);

  // Load notifications on mount and when user changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Try to get user info from token or storage
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId || payload.id;
        setCurrentUserId(userId);
      } catch (error) {
        console.error('Failed to parse token:', error);
      }
    }
    refreshNotifications();
  }, [refreshNotifications]);

  // Refresh notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    try {
      await deleteNotification(id);
      const wasUnread = notifications.find(n => n.id === id)?.read === false;
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to remove notification:', error);
    }
  }, [notifications]);

  const clearAllNotifications = useCallback(async () => {
    try {
      await clearAllNotificationsAPI();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    refreshNotifications,
    clearUserData,
    initializeForUser
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
