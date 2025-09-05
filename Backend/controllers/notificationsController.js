const Notification = require('../models/Notification');

// Get all notifications for a user (or all if no userId)
exports.getNotifications = async (req, res) => {
  try {
    const { userId, read, type, limit = 50, page = 1 } = req.query;
    
    const filter = {};
    if (userId) filter.userId = userId;
    if (read !== undefined) filter.read = read === 'true';
    if (type) filter.type = type;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('userId', 'name email');

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      ...filter, 
      read: false 
    });

    res.json({
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, userId, relatedId, icon, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const notification = new Notification({
      title,
      message,
      type: type || 'general',
      userId,
      relatedId,
      icon,
      priority: priority || 'medium'
    });

    await notification.save();
    await notification.populate('userId', 'name email');

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    ).populate('userId', 'name email');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Only add userId to filter if it's provided and not null
    const filter = { read: false };
    if (userId && userId !== null) {
      filter.userId = userId;
    }
    
    const result = await Notification.updateMany(
      filter,
      { read: true }
    );

    res.json({ 
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear all notifications for a user
exports.clearAllNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Only add userId to filter if it's provided and not null
    const filter = {};
    if (userId && userId !== null) {
      filter.userId = userId;
    }
    
    const result = await Notification.deleteMany(filter);

    res.json({ 
      message: 'All notifications cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing all notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const filter = { read: false };
    if (userId) filter.userId = userId;
    
    const count = await Notification.countDocuments(filter);
    
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to create notifications (for use in other controllers)
exports.createNotificationHelper = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
