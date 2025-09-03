const express = require('express');
const router = express.Router();
const InterviewQuestion = require('../models/InterviewQuestion');

// Get all questions for an interview
router.get('/:interviewId', async (req, res) => {
  try {
    const questions = await InterviewQuestion.find({ interviewId: req.params.interviewId }).sort({ order: 1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a question
router.post('/', async (req, res) => {
  try {
    const question = new InterviewQuestion(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a question
router.put('/:id', async (req, res) => {
  try {
    const question = await InterviewQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a question
router.delete('/:id', async (req, res) => {
  try {
    await InterviewQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
