const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Participation = require("../models/Participation");
const Notification = require("../models/Notification");
const Student = require("../models/studentUser"); // ✅ Import student model
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// ✅ Ensure uploads directory exists
const uploadDir = "./Uploads/Participants";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer configuration
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// ✅ POST /api/participation — Student submits participation form
router.post("/", verifyToken, upload.single("idCard"), async (req, res) => {
    try {
        const {
            institute,
            rollNo,
            gender,
            contact,
            eventId,
            organizerInstituteId,
        } = req.body;

        const studentId = req.user.id;

        // ✅ Get student name from DB
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        const name = student.name;

        // ✅ Validate required fields
        if (
            !name ||
            !institute ||
            !rollNo ||
            !contact ||
            !eventId ||
            !organizerInstituteId ||
            !studentId
        ) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // ✅ Check if the student already participated in this event
        const existingParticipation = await Participation.findOne({
            eventId,
            studentId,
        });

        if (existingParticipation) {
            return res.status(400).json({
                message: "You have already submitted the participation form for this event.",
            });
        }

        // ✅ Save participation info to DB
        const newParticipation = new Participation({
            name,
            institute,
            rollNo,
            gender,
            contact,
            eventId,
            organizerInstituteId,
            studentId,
            idCardPath: req.file?.path || null,
        });

        const saved = await newParticipation.save();

        // ✅ Create a notification for the institute
        await Notification.create({
            type: "participation",
            eventId,
            instituteId: organizerInstituteId,
            studentName: name,
            rollNo,
            contact,
            gender,
            instituteName: institute,
            idCardPath: req.file?.path || null,
            studentId,
            isRead: false,
        });

        res.status(201).json({
            message: "Participation submitted and notification sent successfully",
            participation: saved,
        });
    } catch (error) {
        console.error("Error submitting participation:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
