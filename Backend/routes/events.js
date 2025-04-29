// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const jwt = require("jsonwebtoken");
// const router = express.Router();
// const Event = require("../models/Event");

// // Ensure Uploads directory exists
// const uploadDir = "./Uploads";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//     destination: uploadDir,
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "_" + file.originalname);
//     },
// });
// const upload = multer({ storage: storage });

// // Middleware: Validate token & auto-fetch user ID
// const authenticateUser = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Unauthorized. Please log in." });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
//         req.userId = decoded.id;
//         req.signupType = decoded.signupType;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token." });
//     }
// };

// // Route: Create an Event
// router.post(
//     "/",
//     authenticateUser,
//     upload.fields([
//         { name: "eventPhoto", maxCount: 5 },
//         { name: "organizerPhoto", maxCount: 1 },
//     ]),
//     async (req, res) => {
//         try {
//             console.log("Files received:", req.files);
//             console.log("Body received:", req.body);

//             const {
//                 eventName,
//                 eventDate,
//                 eventDescription,
//                 organizerName,
//                 organizerDescription,
//             } = req.body;
//             const createdBy = req.userId;

//             if (!createdBy) return res.status(400).json({ message: "Missing institute ID. Please log in again." });

//             const formattedEventDate = new Date(eventDate);

//             if (
//                 !eventName ||
//     // Route: Get events by institute ID (public access)            isNaN(formattedEventDate) ||
//                 !eventDescription ||
//                 !req.files.eventPhoto ||
//                 !organizerName
//             ) {
//                 return res.status(400).json({ message: "Missing required fields." });
//             }

//             const newEvent = new Event({
//                 eventName,
//                 eventDate: formattedEventDate,
//                 eventDescription,
//                 eventPhotos: req.files.eventPhoto.map(file => file.path),
//                 organizerName,
//                 organizerPhoto: req.files.organizerPhoto ? req.files.organizerPhoto[0].path : null,
//                 organizerDescription,
//                 createdBy,
//             });

//             const savedEvent = await newEvent.save();
//             res.status(201).json({ message: "Event created successfully!", event: savedEvent });
//         } catch (error) {
//             console.error("Server Error:", error);
//             res.status(500).json({ message: "Internal Server Error", error: error.message });
//         }
//     }
// );

// // Route: Get Events for logged-in Institute
// router.get("/", authenticateUser, async (req, res) => {
//     try {
//         console.log("Decoded userId from token:", req.userId);
//         const events = await Event.find({ createdBy: req.userId }).populate("createdBy", "name email");

//         res.status(200).json({ events });
//     } catch (error) {
//         console.error("Error fetching events:", error.message);
//         res.status(500).json({ message: "Server error occurred.", error: error.message });
//     }
// });


// // Route: Get Events by Institute ID (for public view)
// router.get("/institute/:instituteId", async (req, res) => {
//     try {
//         const { instituteId } = req.params;

//         if (!instituteId) {
//             return res.status(400).json({ message: "Missing institute ID." });
//         }

//         const events = await Event.find({ createdBy: instituteId }).populate("createdBy", "name email");

//         res.status(200).json({ events });
//     } catch (error) {
//         console.error("Error fetching events by institute ID:", error.message);
//         res.status(500).json({ message: "Server error occurred.", error: error.message });
//     }
// });


// module.exports = router;
// routes/events.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Event = require("../models/Event");

// Ensure Uploads directory exists
const uploadDir = "./Uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Middleware: Validate token & auto-fetch user ID
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized. Please log in." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        req.userId = decoded.id;
        req.signupType = decoded.signupType;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

// Route: Create an Event
router.post(
    "/",
    authenticateUser,
    upload.fields([
        { name: "eventPhoto", maxCount: 5 },
        { name: "organizerPhoto", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            console.log("Files received:", req.files);
            console.log("Body received:", req.body);

            const {
                eventName,
                eventDate,
                eventDescription,
                organizerName,
                organizerDescription,
            } = req.body;
            const createdBy = req.userId;

            if (!createdBy) return res.status(400).json({ message: "Missing institute ID. Please log in again." });

            const formattedEventDate = new Date(eventDate);

            if (
                !eventName ||
                isNaN(formattedEventDate) ||
                !eventDescription ||
                !req.files?.eventPhoto || // Use optional chaining for files
                !organizerName
            ) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            const newEvent = new Event({
                eventName,
                eventDate: formattedEventDate,
                eventDescription,
                eventPhotos: req.files.eventPhoto.map(file => file.path),
                organizerName,
                organizerPhoto: req.files?.organizerPhoto ? req.files.organizerPhoto[0].path : null, // Use optional chaining
                organizerDescription,
                createdBy,
            });

            const savedEvent = await newEvent.save();
            res.status(201).json({ message: "Event created successfully!", event: savedEvent });
        } catch (error) {
            console.error("Server Error:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
);

// Route: Get Events for logged-in Institute
router.get("/", authenticateUser, async (req, res) => {
    try {
        console.log("Decoded userId from token:", req.userId);
        const events = await Event.find({ createdBy: req.userId }).populate("createdBy", "name email");
        res.status(200).json({ events });
    } catch (error) {
        console.error("Error fetching events:", error.message);
        res.status(500).json({ message: "Server error occurred.", error: error.message });
    }
});


// Route: Get Events by Institute ID (for public view)
router.get("/institute/:instituteId", async (req, res) => {
    try {
        const { instituteId } = req.params;

        if (!instituteId) {
            return res.status(400).json({ message: "Missing institute ID." });
        }

        const events = await Event.find({ createdBy: instituteId }).populate("createdBy", "name email");
        res.status(200).json({ events });
    } catch (error) {
        console.error("Error fetching events by institute ID:", error.message);
        res.status(500).json({ message: "Server error occurred.", error: error.message });
    }
});


module.exports = router;