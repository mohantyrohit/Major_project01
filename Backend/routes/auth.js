const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Institute = require("../models/instituteUser");
const Student = require("../models/studentUser");

// Token Refresh Endpoint
router.post("/refresh", async (req, res) => {
    try {
        const refreshToken = req.headers.authorization?.split(" ")[1];

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "No refresh token provided." });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if user still exists
        let user;
        if (decoded.signupType === "institute") {
            user = await Institute.findById(decoded.id);
        } else {
            user = await Student.findById(decoded.id);
        }

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found",
                code: "USER_NOT_FOUND"
            });
        }

        // Generate new access token
        const newToken = jwt.sign(
            { id: user._id, signupType: user.signupType },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.status(200).json({
            success: true,
            token: newToken,
            user: {
                id: user._id,
                name: user.name,
                signupType: user.signupType
            }
        });

    } catch (error) {
        console.error("Refresh token error:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token", code: "INVALID_TOKEN" });
        }

        return res.status(500).json({ success: false, message: "Internal server error", code: "SERVER_ERROR" });
    }
});

module.exports = router;
