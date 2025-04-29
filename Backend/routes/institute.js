const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Institute = require("../models/instituteUser");
const { generateToken, hashPassword, comparePasswords } = require("../helpers/authHelpers");

// Institute Signup
router.post("/signup", async (req, res) => {
  const { name, instituteId, password } = req.body;

  if (!name || !instituteId || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const existingInstitute = await Institute.findOne({ instituteId });
    if (existingInstitute) {
      return res.status(400).json({ success: false, message: "Institute already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newInstitute = new Institute({
      name,
      instituteId,
      password: hashedPassword,
      signupType: "institute",
    });

    await newInstitute.save();

    const token = generateToken(newInstitute);

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Institute Login ✅ updated to include name in token
router.post("/login", async (req, res) => {
  const { instituteId, password } = req.body;

  if (!instituteId || !password) {
    return res.status(400).json({ success: false, message: "Institute ID and password are required" });
  }

  try {
    const institute = await Institute.findOne({ instituteId });
    if (!institute) {
      return res.status(404).json({ success: false, message: "Institute not found" });
    }

    const isMatch = await bcrypt.compare(password, institute.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({
      _id: institute._id,
      name: institute.name, // ✅ include name in payload
      signupType: "institute",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: institute._id,
        name: institute.name,
        instituteId: institute.instituteId,
        signupType: "institute",
      },
      signupType: "institute",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get Institute Name
router.get("/getUserName", auth, async (req, res) => {
  try {
    if (req.signupType !== "institute") {
      return res.status(403).json({
        success: false,
        message: `Access denied: Endpoint requires institute credentials. Received ${req.signupType || "unknown"} credentials.`,
        requiredType: "institute",
        receivedType: req.signupType || "unknown",
      });
    }

    const userId = req.userId;
    const user = await Institute.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Institute not found" });
    }

    res.status(200).json({ success: true, name: user.name });
  } catch (error) {
    console.error("Error in /getUserName:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
