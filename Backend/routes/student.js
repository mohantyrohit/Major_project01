
//////////////////////////////////////
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // For token handling
const bcrypt = require("bcryptjs"); // For password hashing and comparison
const Student = require("../models/studentUser"); // MongoDB Student model
const { generateToken, hashPassword, comparePasswords } = require("../helpers/authHelpers"); // Helper functions for auth

// Student Signup
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ success: false, message: "Student already exists" });
        }

        const hashedPassword = await hashPassword(password);
        const newStudent = new Student({
            name,
            email,
            password: hashedPassword,
            signupType: "student",
        });

        await newStudent.save();
        const token = generateToken(newStudent);

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Student Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const isMatch = await comparePasswords(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(student); // Generate token for authenticated user
        res.status(200).json({
            success: true,
            token,
            user: { name: student.name, email: student.email },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Get User Name (check if authenticated)
router.get("/getUserName", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token using secret key

        const user = await Student.findById(decoded.id); // Find user by decoded ID
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, name: user.name });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        console.error("Error in getUserName:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
// Get current logged-in student
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const student = await Student.findById(decoded.id).select("-password"); // Don't return password
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        console.error("Error in /me route:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});


// Logout (clear token or session)
router.post("/logout", async (req, res) => {
    try {
        res.clearCookie("authToken"); // Clear cookie if used for sessions
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;