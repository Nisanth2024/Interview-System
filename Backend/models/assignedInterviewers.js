const mongoose = require('mongoose');

const AssignedInterviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('AssignedInterviewer', AssignedInterviewerSchema);
