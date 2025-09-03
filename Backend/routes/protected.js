const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Example protected route
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected profile route', user: req.user });
});

module.exports = router;
