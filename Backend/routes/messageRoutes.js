// //This the 1st where institute chat work correctly 
// const express = require("express");
// const mongoose = require("mongoose");
// const Message = require("../models/Message");
// const verifyToken = require("../middleware/verifyToken");

// const router = express.Router();

// /**
//  * ✅ POST: Send a message
//  */
// router.post("/", verifyToken, async (req, res) => {
//   const { receiverId, receiverName, message, eventId, receiverType } = req.body;
//   const { id: senderId, name: senderName, signupType: senderType } = req.user;

//   if (!senderId || !senderType || !senderName)
//     return res.status(400).json({ success: false, message: "Missing sender info (from token)" });

//   if (!receiverId || !receiverName || !message || !receiverType)
//     return res.status(400).json({ success: false, message: "Missing required fields" });

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
//       receiverType,
//     });

//     const savedMessage = await newMessage.save();
//     res.status(201).json({ success: true, message: savedMessage });
//   } catch (error) {
//     console.error("Message save error:", error);
//     res.status(500).json({ success: false, message: "Failed to send message.", error: error.message });
//   }
// });

// /**
//  * ✅ GET: Fetch contacts the student has chatted with
//  * 🟢 This route is now above the generic one
//  */
// router.get("/contacts/:studentId", verifyToken, async (req, res) => {
//   const { studentId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(studentId)) {
//     return res.status(400).json({ success: false, message: "Invalid studentId format" });
//   }

//   try {
//     const contacts = await Message.aggregate([
//       {
//         $match: {
//           $or: [
//             { senderId: new mongoose.Types.ObjectId(studentId) },
//             { receiverId: new mongoose.Types.ObjectId(studentId) },
//           ],
//         },
//       },
//       {
//         $project: {
//           contactId: {
//             $cond: [
//               { $eq: ["$senderType", "institute"] },
//               "$senderId",
//               "$receiverId",
//             ],
//           },
//           contactName: {
//             $cond: [
//               { $eq: ["$senderType", "institute"] },
//               "$senderName",
//               "$receiverName",
//             ],
//           },
//           contactType: {
//             $cond: [
//               { $eq: ["$senderType", "institute"] },
//               "$senderType",
//               "$receiverType",
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$contactId",
//           name: { $first: "$contactName" },
//           type: { $first: "$contactType" },
//         },
//       },
//     ]);

//     res.status(200).json({ success: true, contacts });
//   } catch (err) {
//     console.error("Fetch contacts error:", err);
//     res.status(500).json({ success: false, message: "Failed to fetch contacts", error: err.message });
//   }
// });

// /**
//  * ✅ GET: Fetch all messages between two users
//  */
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
//     console.error("Fetch messages error:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch messages.", error: error.message });
//   }
// });

// module.exports = router;
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

/**
 * ✅ GET: Fetch list of institutes the student has messaged with
 */
router.get("/student/:studentId/institutes", verifyToken, async (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ success: false, message: "Invalid studentId format" });
  }

  try {
    const institutes = await Message.aggregate([
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
          id: {
            $cond: [
              { $eq: ["$senderId", new mongoose.Types.ObjectId(studentId)] },
              "$receiverId",
              "$senderId"
            ]
          },
          name: {
            $cond: [
              { $eq: ["$senderId", new mongoose.Types.ObjectId(studentId)] },
              "$receiverName",
              "$senderName"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$id",
          name: { $first: "$name" }
        }
      },
      {
        $project: {
          id: "$_id",
          name: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({ success: true, institutes });
  } catch (err) {
    console.error("Fetch institutes error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch institutes", error: err.message });
  }
});

module.exports = router;
