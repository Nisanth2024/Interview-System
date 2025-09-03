const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  details: {
    type: String,
    required: false, // Make optional since frontend can auto-generate
    default: '',
    maxlength: 200
  },
  duration: {
    type: Number, // in minutes
    default: 0,
    min: 0,
    max: 300
  },
  questionCount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  order: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate details if empty and update timestamp
SectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-generate details if empty
  if (!this.details || this.details.trim() === '') {
    this.details = `${this.duration || 0}m • ${this.questionCount || 0} Questions`;
  }
  
  next();
});

module.exports = mongoose.model('Section', SectionSchema);
