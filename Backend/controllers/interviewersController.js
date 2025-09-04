const Interviewer = require('../models/Interviewer');
const { createNotificationHelper } = require('./notificationsController');

exports.getAllInterviewers = async (req, res) => {
  // ...get all interviewers logic...
  res.json([]);
};

exports.addInterviewer = async (req, res) => {
  // ...add interviewer logic...
  res.json({ message: 'Add interviewer endpoint' });
};

exports.updateInterviewer = async (req, res) => {
  // ...update interviewer logic...
  res.json({ message: 'Update interviewer endpoint' });
};

exports.deleteInterviewer = async (req, res) => {
  // ...delete interviewer logic...
  res.json({ message: 'Delete interviewer endpoint' });
};
