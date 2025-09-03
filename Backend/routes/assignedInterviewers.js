
const express = require('express');
const router = express.Router();
const AssignedInterviewer = require('../models/AssignedInterviewer');
const authenticateToken = require('../middleware/authenticateToken');

// Get all assigned interviewers for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const interviewers = await AssignedInterviewer.find({ userId: req.user.userId });
    res.json(interviewers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new assigned interviewer for the logged-in user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const interviewer = new AssignedInterviewer({ name, avatar, userId: req.user.userId });
    await interviewer.save();
    res.status(201).json(interviewer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an assigned interviewer (only if owned by user)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const interviewer = await AssignedInterviewer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, avatar },
      { new: true }
    );
    if (!interviewer) return res.status(404).json({ error: 'Not found' });
    res.json(interviewer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an assigned interviewer (only if owned by user)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const interviewer = await AssignedInterviewer.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!interviewer) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
