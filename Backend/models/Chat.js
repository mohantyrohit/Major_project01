const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  instituteId: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    default: null
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    required: true
  },
  eventId: {
    type: String,
    default: null
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'institute'],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);