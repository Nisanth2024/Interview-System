const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount
} = require('../controllers/notificationsController');
const authenticateToken = require('../middleware/authenticateToken');

// Get all notifications
router.get('/', getNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Create a new notification
router.post('/', createNotification);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

// Clear all notifications
router.delete('/clear-all', clearAllNotifications);

module.exports = router;
