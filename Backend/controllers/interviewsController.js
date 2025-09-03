const Interview = require('../models/Interview');

exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.userId });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addInterview = async (req, res) => {
  try {
    const interview = new Interview({ ...req.body, userId: req.user.userId });
    await interview.save();
    res.status(201).json(interview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json(interview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json({ message: 'Interview deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
