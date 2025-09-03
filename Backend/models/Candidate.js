const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  location: String,
  avatar: String,
  status: String,
  rating: Number,
  appliedDate: String,
  experience: String,
  skills: [String],
  department: String
});

module.exports = mongoose.model('Candidate', candidateSchema);
