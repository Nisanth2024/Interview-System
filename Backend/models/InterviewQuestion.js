const mongoose = require('mongoose');

const InterviewQuestionSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
  prompt: { type: String, required: true },
  competency: { type: String, required: true },
  time: { type: String, required: true },
  level: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewQuestion', InterviewQuestionSchema);
