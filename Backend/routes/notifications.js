const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

/**
 * GET /api/notifications
 * Fetch all notifications for a specific institute
 */
router.get("/", async (req, res) => {
  try {
    const { instituteId } = req.query;

    if (!instituteId) {
      return res.status(400).json({ success: false, message: "Institute ID is required." });
    }

    const notifications = await Notification.find({ instituteId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

/**
 * PUT /api/notifications/mark-read/:instituteId
 * Mark all notifications for the given institute as read
 */
router.put("/mark-read/:instituteId", async (req, res) => {
  try {
    const { instituteId } = req.params;

    if (!instituteId) {
      return res.status(400).json({ success: false, message: "Institute ID is required in params." });
    }

    const result = await Notification.updateMany(
      { instituteId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "Notifications marked as read.",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error marking notifications read:", error);
    res.status(500).json({ success: false, message: "Failed to mark notifications as read." });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a specific notification permanently
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    res.status(200).json({ success: true, message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, message: "Failed to delete notification." });
  }
});

module.exports = router;

// const express = require("express");
// const Notification = require("../models/Notification");
// const router = express.Router();

// /**
//  * GET /api/notifications
//  * Fetch notifications for a specific institute
//  * Optional query params: type, page, limit
//  */
// router.get("/", async (req, res) => {
//   try {
//     const { instituteId, type, page = 1, limit = 10 } = req.query;

//     if (!instituteId) {
//       return res.status(400).json({ success: false, message: "Institute ID is required." });
//     }

//     const query = { instituteId };
//     if (type) {
//       query.type = type; // Filtering by type (e.g., "request", "participant")
//     }

//     const notifications = await Notification.find(query)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .populate("studentId", "name"); // Populate sender details (student) for participant notifications

//     const total = await Notification.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       notifications,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch notifications." });
//   }
// });

// /**
//  * POST /api/notifications
//  * Create a new notification (for participation or request)
//  */
// router.post("/", async (req, res) => {
//   try {
//     const {
//       type,
//       instituteId,
//       eventId,
//       studentId,
//       studentName,
//       rollNo,
//       contact,
//       gender,
//       idCardPath,
//       message,
//       instituteName,
//     } = req.body;

//     if (!type || !instituteId) {
//       return res.status(400).json({ success: false, message: "Type and Institute ID are required." });
//     }

//     const newNotification = new Notification({
//       type,
//       instituteId,
//       eventId,
//       studentId,
//       studentName,
//       rollNo,
//       contact,
//       gender,
//       idCardPath,
//       message,
//       instituteName,
//     });

//     await newNotification.save();

//     res.status(201).json({ success: true, message: "Notification created successfully.", notification: newNotification });
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     res.status(500).json({ success: false, message: "Failed to create notification." });
//   }
// });

// /**
//  * PUT /api/notifications/mark-read/:instituteId
//  * Mark all notifications for the given institute as read
//  */
// router.put("/mark-read/:instituteId", async (req, res) => {
//   try {
//     const { instituteId } = req.params;

//     const result = await Notification.updateMany(
//       { instituteId, isRead: false },
//       { $set: { isRead: true } }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Notifications marked as read.",
//       modifiedCount: result.modifiedCount,
//     });
//   } catch (error) {
//     console.error("Error marking notifications read:", error);
//     res.status(500).json({ success: false, message: "Failed to mark notifications as read." });
//   }
// });

// /**
//  * PUT /api/notifications/mark-read-single/:id
//  * Mark a single notification as read
//  */
// router.put("/mark-read-single/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updated = await Notification.findByIdAndUpdate(
//       id,
//       { isRead: true },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "Notification not found." });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Notification marked as read.",
//       notification: updated,
//     });
//   } catch (error) {
//     console.error("Error marking notification as read:", error);
//     res.status(500).json({ success: false, message: "Failed to mark notification as read." });
//   }
// });

// /**
//  * DELETE /api/notifications/:id
//  * Delete a specific notification
//  */
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await Notification.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({ success: false, message: "Notification not found." });
//     }

//     res.status(200).json({ success: true, message: "Notification deleted successfully." });
//   } catch (error) {
//     console.error("Error deleting notification:", error);
//     res.status(500).json({ success: false, message: "Failed to delete notification." });
//   }
// });

// module.exports = router;
