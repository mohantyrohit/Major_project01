const mongoose = require('mongoose');

const RequestFormSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderMobile: { // Add this field
    type: String,
    required: false // Or true, depending on your requirement
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming institutes are also users
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RequestForm', RequestFormSchema);

// const mongoose = require("mongoose");

// const requestFormSchema = new mongoose.Schema({
//   senderId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentUser", required: true },
//   senderName: { type: String, required: true },
//   receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "InstituteUser", required: true },
//   title: { type: String, required: true },
//   message: { type: String, required: true },
//   date: { type: Date },
//   status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
// }, { timestamps: true }); // this adds createdAt & updatedAt automatically

// module.exports = mongoose.model("RequestForm", requestFormSchema);
