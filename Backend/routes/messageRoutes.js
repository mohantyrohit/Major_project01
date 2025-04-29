
// const express = require("express");
// const mongoose = require("mongoose");
// const Message = require("../models/Message");
// const verifyToken = require("../middleware/verifyToken");

// const router = express.Router();

// // ✅ POST: Send a message
// router.post("/", verifyToken, async (req, res) => {
//   const { receiverId, receiverName, message, eventId } = req.body;
//   const { id: senderId, name: senderName, signupType: senderType } = req.user;

//   if (!senderId) return res.status(400).json({ success: false, message: "Missing senderId (token)" });
//   if (!senderType) return res.status(400).json({ success: false, message: "Missing senderType (token)" });
//   if (!senderName) return res.status(400).json({ success: false, message: "Missing senderName (token)" });
//   if (!receiverId) return res.status(400).json({ success: false, message: "Missing receiverId" });
//   if (!receiverName) return res.status(400).json({ success: false, message: "Missing receiverName" });
//   if (!message) return res.status(400).json({ success: false, message: "Missing message content" });

//   let processedEventId = undefined;
//   if (eventId) {
//     if (mongoose.Types.ObjectId.isValid(eventId)) {
//       processedEventId = new mongoose.Types.ObjectId(eventId);
//     } else {
//       return res.status(400).json({ success: false, message: "Invalid eventId format" });
//     }
//   }

//   try {
//     const newMessage = new Message({
//       senderId,
//       senderType,
//       senderName,
//       receiverId,
//       receiverName,
//       message,
//       eventId: processedEventId,
//     });

//     const savedMessage = await newMessage.save();
//     res.status(201).json({ success: true, message: savedMessage });
//   } catch (error) {
//     console.error("Message save error:", error.message);
//     res.status(500).json({ success: false, message: "Failed to send message.", error: error.message });
//   }
// });

// // ✅ GET: Fetch messages between two users
// router.get("/:userId/:contactId", verifyToken, async (req, res) => {
//   const { userId, contactId } = req.params;

//   try {
//     const messages = await Message.find({
//       $or: [
//         { senderId: userId, receiverId: contactId },
//         { senderId: contactId, receiverId: userId },
//       ],
//     }).sort({ timestamp: 1 });

//     res.status(200).json({ success: true, messages });
//   } catch (error) {
//     console.error("Fetch messages error:", error.message);
//     res.status(500).json({ success: false, message: "Failed to fetch messages.", error: error.message });
//   }
// });

// // ✅ GET: Check for unread messages for a student
// router.get("/unread/:studentId", verifyToken, async (req, res) => {
//   const { studentId } = req.params;

//   try {
//     const unreadMessages = await Message.find({
//       receiverId: studentId,
//       receiverType: "student",
//       isRead: false,
//     });

//     res.status(200).json({
//       success: true,
//       newMessagesExist: unreadMessages.length > 0,
//       count: unreadMessages.length,
//     });
//   } catch (error) {
//     console.error("Unread message check error:", error.message);
//     res.status(500).json({ success: false, message: "Failed to check unread messages.", error: error.message });
//   }
// });

// // ✅ PUT: Mark messages as read between a student and a contact
// router.put("/markAsRead/:studentId/:contactId", verifyToken, async (req, res) => {
//   const { studentId, contactId } = req.params;

//   try {
//     const result = await Message.updateMany(
//       {
//         senderId: contactId,
//         receiverId: studentId,
//         receiverType: "student",
//         isRead: false,
//       },
//       { $set: { isRead: true } }
//     );

//     res.status(200).json({
//       success: true,
//       updatedCount: result.modifiedCount,
//     });
//   } catch (error) {
//     console.error("Mark as read error:", error.message);
//     res.status(500).json({ success: false, message: "Failed to mark messages as read.", error: error.message });
//   }
// });

// module.exports = router;
// // routes/messages.js
const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

/**
 * ✅ POST: Send a message
 */
router.post("/", verifyToken, async (req, res) => {
  const { receiverId, receiverName, message, eventId, receiverType } = req.body;
  const { id: senderId, name: senderName, signupType: senderType } = req.user;

  if (!senderId || !senderType || !senderName)
    return res.status(400).json({ success: false, message: "Missing sender info (from token)" });

  if (!receiverId || !receiverName || !message || !receiverType)
    return res.status(400).json({ success: false, message: "Missing required fields" });

  let processedEventId = undefined;
  if (eventId) {
    if (mongoose.Types.ObjectId.isValid(eventId)) {
      processedEventId = new mongoose.Types.ObjectId(eventId);
    } else {
      return res.status(400).json({ success: false, message: "Invalid eventId format" });
    }
  }

  try {
    const newMessage = new Message({
      senderId,
      senderType,
      senderName,
      receiverId,
      receiverName,
      message,
      eventId: processedEventId,
      receiverType,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json({ success: true, message: savedMessage });
  } catch (error) {
    console.error("Message save error:", error);
    res.status(500).json({ success: false, message: "Failed to send message.", error: error.message });
  }
});

/**
 * ✅ GET: Fetch contacts the student has chatted with
 * 🟢 This route is now above the generic one
 */
router.get("/contacts/:studentId", verifyToken, async (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ success: false, message: "Invalid studentId format" });
  }

  try {
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(studentId) },
            { receiverId: new mongoose.Types.ObjectId(studentId) },
          ],
        },
      },
      {
        $project: {
          contactId: {
            $cond: [
              { $eq: ["$senderType", "institute"] },
              "$senderId",
              "$receiverId",
            ],
          },
          contactName: {
            $cond: [
              { $eq: ["$senderType", "institute"] },
              "$senderName",
              "$receiverName",
            ],
          },
          contactType: {
            $cond: [
              { $eq: ["$senderType", "institute"] },
              "$senderType",
              "$receiverType",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$contactId",
          name: { $first: "$contactName" },
          type: { $first: "$contactType" },
        },
      },
    ]);

    res.status(200).json({ success: true, contacts });
  } catch (err) {
    console.error("Fetch contacts error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch contacts", error: err.message });
  }
});

/**
 * ✅ GET: Fetch all messages between two users
 */
router.get("/:userId/:contactId", verifyToken, async (req, res) => {
  const { userId, contactId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch messages.", error: error.message });
  }
});

module.exports = router;
