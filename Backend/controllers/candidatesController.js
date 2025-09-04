const Candidate = require('../models/Candidate');
const { createNotificationHelper } = require('./notificationsController');

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ userId: req.user.userId });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCandidate = async (req, res) => {
  try {
    const candidate = new Candidate({ ...req.body, userId: req.user.userId });
    await candidate.save();

    // Create notification for new candidate
    try {
      await createNotificationHelper({
        title: 'New Candidate Registered',
        message: `${candidate.name} has registered for the ${candidate.department || 'position'}`,
        type: 'candidate',
        userId: req.user.userId,
        relatedId: candidate._id,
        icon: '👤',
        priority: 'medium'
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
    }

    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    // Create notification for candidate update
    try {
      await createNotificationHelper({
        title: 'Candidate Updated',
        message: `${candidate.name}'s profile has been updated`,
        type: 'candidate',
        userId: req.user.userId,
        relatedId: candidate._id,
        icon: '✏️',
        priority: 'low'
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
    }

    res.json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
