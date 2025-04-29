// routes/authTokenRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentUser");
const Institute = require("../models/instituteUser");
const { generateToken } = require("../helpers/authHelpers");

const router = express.Router();

// POST /api/auth/refresh-token
router.post("/refresh-token", async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) return res.status(403).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
    const user = await Student.findById(decoded.id) || await Institute.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = generateToken(user);
    res.json({ accessToken });
  } catch (err) {
    console.error("Refresh error:", err.message);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

module.exports = router;
