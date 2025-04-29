const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: { type: String, default: "participation" },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" }, // Institute receiving the notification
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // ✅ Add this
  studentName: String,
  rollNo: String,
  contact: String,
  gender: String,
  instituteName: String,
  idCardPath: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema({
//   type: { 
//     type: String, 
//     enum: ["participation", "request"], // restrict to these values
//     required: true 
//   },

//   // Common fields
//   instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
//   eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // may be null for requests
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // may be null for certain requests

//   // Participant-specific fields
//   studentName: String,
//   rollNo: String,
//   contact: String,
//   gender: String,
//   idCardPath: String,

//   // Request-specific fields
//   message: String, // request message content

//   instituteName: String, // if needed for display

//   isRead: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Notification", notificationSchema);
