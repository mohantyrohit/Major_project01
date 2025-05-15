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
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const router = express.Router();
const Participant = require("../models/Participation");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// In-memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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

// Route: Students participate in events
router.post(
  "/participate",
  authenticateUser,
  upload.single("idCard"),
  async (req, res) => {
    try {
      const {
        name,
        institute,
        rollNo,
        gender,
        contact,
        eventId,
        organizerInstituteId
      } = req.body;

      // Validate required fields
      if (!name || !institute || !rollNo || !gender || !contact || !eventId || !organizerInstituteId || !req.file) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Check if already participated
      const existingParticipation = await Participant.findOne({
        studentId: req.userId,
        eventId
      });

      if (existingParticipation) {
        return res.status(400).json({ message: "You have already submitted participation for this event." });
      }

      // Upload ID card to Cloudinary
      let idCardUrl;
      try {
        // Convert buffer to base64 string for Cloudinary upload
        const base64File = Buffer.from(req.file.buffer).toString("base64");
        const fileType = req.file.mimetype;
        const dataURI = `data:${fileType};base64,${base64File}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "event_participants",
          resource_type: "auto",
        });
        
        idCardUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload ID card." });
      }

      // Create new participant
      const newParticipant = new Participant({
        name,
        institute,
        rollNo,
        gender,
        contact,
        idCard: idCardUrl,
        eventId,
        organizerInstituteId,
        studentId: req.userId,
        participationDate: new Date()
      });

      await newParticipant.save();
      res.status(201).json({ message: "Successfully registered for the event!" });
    } catch (error) {
      console.error("Participation error:", error);
      res.status(500).json({ message: "Server error occurred.", error: error.message });
    }
  }
);

// Get all participations for a specific event
router.get("/participations/:eventId", authenticateUser, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Verify the requester is the organizer of this event
    // This would typically check if the event with ID 'eventId' was created by req.userId
    // Implementation depends on your Event model structure
    
    const participants = await Participant.find({ eventId });
    res.status(200).json({ participants });
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ message: "Server error occurred.", error: error.message });
  }
});

module.exports = router;