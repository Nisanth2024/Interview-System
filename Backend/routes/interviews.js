const express = require('express');
const router = express.Router();
const interviewsController = require('../controllers/interviewsController');
const authenticateToken = require('../middleware/authenticateToken');

// Get all interviews for the logged-in user
router.get('/', authenticateToken, interviewsController.getAllInterviews);

// Add a new interview for the logged-in user
router.post('/', authenticateToken, interviewsController.addInterview);

// Update an interview (user-specific)
router.put('/:id', authenticateToken, interviewsController.updateInterview);

// Delete an interview (user-specific)
router.delete('/:id', authenticateToken, interviewsController.deleteInterview);

module.exports = router;
