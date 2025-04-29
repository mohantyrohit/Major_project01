const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventDescription: { type: String, required: true },
    eventPhotos: [{ type: String }],
    organizerName: { type: String, required: true },
    organizerPhoto: { type: String },
    organizerDescription: { type: String },
    
    // ✅ Fix this line
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
