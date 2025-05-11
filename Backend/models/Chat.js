const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  userName: String,
  userEmail: String,
  message: String,
  sender: String, // 'user' or 'institute'
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
