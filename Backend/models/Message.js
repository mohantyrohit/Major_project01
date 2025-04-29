// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   senderType: {
//     type: String,
//     enum: ["student", "institute"],
//     required: true,
//   },
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   receiverId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   senderName: {
//     type: String,
//     required: true,
//   },
//   receiverName: {
//     type: String,
//     required: true,
//   },
//   eventId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Event",
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
  
// });

// module.exports = mongoose.model("Message", messageSchema);
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderType: {
    type: String,
    enum: ["student", "institute"],
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  receiverType: {
    type: String,
    enum: ["student", "institute"],
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Optional performance optimizations (still relevant):
messageSchema.index({ senderId: 1, receiverId: 1 });

module.exports = mongoose.model("Message", messageSchema);