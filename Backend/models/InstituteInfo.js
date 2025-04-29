const mongoose = require("mongoose");

const instituteInfoSchema = new mongoose.Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  instituteName: { type: String, required: true },
  description: { type: String }, // New field for institute description
  institutePictureUrl: { type: String }, // Field for uploaded picture path
  nearestMallName: { type: String },
  nearestMallEmbedUrl: { type: String },
  medicineStoreName: { type: String },
  medicineStoreEmbedUrl: { type: String },
  bookstoreName: { type: String },
  bookstoreEmbedUrl: { type: String },
  atmName: { type: String },
  atmEmbedUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "InstituteUser", required: true }, // User reference
}, { timestamps: true });

module.exports = mongoose.model("InstituteInfo", instituteInfoSchema);