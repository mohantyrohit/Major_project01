const mongoose = require("mongoose");

const ParticipationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  institute: { type: String, required: true },
  rollNo: { type: String, required: true },
  gender: { type: String },
  contact: { type: String, required: true },
  idCardPath: { type: String },

  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  organizerInstituteId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // ✅ Add this line to capture which student is participating
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

}, { timestamps: true });

module.exports = mongoose.model("Participation", ParticipationSchema);
