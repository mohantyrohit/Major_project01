const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewText: { type: String, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  userName: { type: String, default: "Anonymous" },
  institute: {type: mongoose.Schema.Types.ObjectId,ref: "InstituteInfo",required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);