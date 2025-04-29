const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const InstituteInfo = require("../models/InstituteInfo");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

// Ensure upload directory exists
const uploadPath = process.env.UPLOAD_DIR || path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Use dynamically configured path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
    },
});
const upload = multer({ storage });

router.get("/all", async (req, res) => {
    try {
        const instituteInfos = await InstituteInfo.find({});
        if (!instituteInfos.length) {
            return res.status(404).json({ success: false, message: "No information found." });
        }
        res.status(200).json({ success: true, data: instituteInfos });
    } catch (error) {
        console.error("Error fetching all institute information:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch data." });
    }
});

// ====================== ROUTES ====================== //


// POST: Add new institute information
router.post(
    "/",
    auth,
    upload.single("institutePicture"),
    [
        body("state").notEmpty().withMessage("State is required"),
        body("district").notEmpty().withMessage("District is required"),
        body("instituteName").notEmpty().withMessage("Institute Name is required"),
        body("nearestMallEmbedUrl").optional().isURL().withMessage("Invalid URL"),
        body("medicineStoreEmbedUrl").optional().isURL().withMessage("Invalid URL"),
        body("bookstoreEmbedUrl").optional().isURL().withMessage("Invalid URL"),
        body("atmEmbedUrl").optional().isURL().withMessage("Invalid URL"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation Errors:", errors.array());
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const instituteId = req.userId;
            const newInstituteInfo = new InstituteInfo({
                ...req.body,
                createdBy: instituteId,
                institutePictureUrl: req.file ? `/uploads/${req.file.filename}` : null,
            });

            const savedInfo = await newInstituteInfo.save();
            console.log("Institute info saved successfully:", savedInfo);
            res.status(201).json({
                success: true,
                message: "Institute information added successfully!",
                data: savedInfo,
            });
        } catch (error) {
            console.error("Error saving institute information:", error.message);
            res.status(500).json({ success: false, message: "Failed to add data." });
        }
    }
);

// GET: Fetch all institute information for the logged-in user
router.get("/", auth, async (req, res) => {
    try {
        const instituteId = req.userId;

        const instituteInfos = await InstituteInfo.find({ createdBy: instituteId });
        if (!instituteInfos.length) {
            return res.status(404).json({ success: false, message: "No information found for this institute." });
        }

        res.status(200).json({ success: true, data: instituteInfos });
    } catch (error) {
        console.error("Error fetching institute information:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch data." });
    }
});

// GET: Fetch all distinct states
router.get("/states", async (req, res) => {
    try {
        const states = await InstituteInfo.distinct("state");
        res.status(200).json({ success: true, states });
    } catch (error) {
        console.error("Error fetching states:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch states." });
    }
});

// GET: Fetch districts by state
router.get("/districts/:state", async (req, res) => {
    try {
        const state = req.params.state;
        const districts = await InstituteInfo.find({ state }).distinct("district");
        res.status(200).json({ success: true, districts });
    } catch (error) {
        console.error("Error fetching districts:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch districts." });
    }
});

// GET: Fetch institutes by state and district
router.get("/institutes/:state/:district", async (req, res) => {
    try {
        const { state, district } = req.params;
        const institutes = await InstituteInfo.find({ state, district }).select("instituteName");

        if (!institutes || institutes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No institutes found for the specified state and district.",
            });
        }

        res.status(200).json({ success: true, institutes });
    } catch (error) {
        console.error("Error fetching institutes:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch institutes." });
    }
});
router.get("/details", async (req, res) => {
    try {
        let { instituteName } = req.query;

        if (!instituteName) {
            return res.status(400).json({ success: false, message: "Institute name is required." });
        }

        instituteName = instituteName.trim(); // Trim spaces
        console.log("Fetching details for:", instituteName);

        const institute = await InstituteInfo.findOne({ instituteName: new RegExp(`^${instituteName}$`, "i") });

        if (!institute) {
            return res.status(404).json({ success: false, message: "Institute not found." });
        }

        res.status(200).json({ success: true, institute });
    } catch (error) {
        console.error("Error fetching institute details:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch details." });
    }
    });
    
     module.exports = router;