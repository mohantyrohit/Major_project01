const mongoose = require("mongoose");

const InstituteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    instituteId: { type: String, unique: true, required: true }, // Unique ID for institutes
    password: { type: String, required: true }, // Hashed password
    signupType: { type: String, default: "institute", enum: ["institute"] },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model("Institute", InstituteSchema);
