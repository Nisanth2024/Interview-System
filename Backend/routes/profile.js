const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const userId = req.user.userId;
    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email, avatar },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({
      message: 'Profile updated',
      user: {
        name: updated.name,
        email: updated.email,
        avatar: updated.avatar || ''
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
