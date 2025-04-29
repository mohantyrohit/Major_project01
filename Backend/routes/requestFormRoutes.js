const express = require("express");
const RequestForm = require("../models/RequestForm");
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// POST: Student sends form request
router.post("/", verifyToken, async (req, res) => {
  const { receiverId, title, message, date, senderMobile } = req.body; // Receive senderMobile
  const { id: senderId, name: senderName } = req.user;

  if (!receiverId || !title || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const newRequest = new RequestForm({ senderId, senderName, receiverId, title, message, date, senderMobile }); // Save senderMobile
    const savedRequest = await newRequest.save();

    const newNotification = new Notification({
      receiverId,
      message: `<span class="math-inline">\{senderName\} sent a function request\: "</span>{title}"`,
      formId: savedRequest._id,
      type: "function-request"
    });

    await newNotification.save();

    res.status(201).json({ success: true, request: savedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Request submission failed.", error: error.message });
  }
});
// GET: Fetch form requests for an institute
router.get("/:instituteId", verifyToken, async (req, res) => {
  const { instituteId } = req.params;

  try {
    const requests = await RequestForm.find({ receiverId: instituteId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch requests.", error: error.message });
  }
});

// PATCH: Update request status (accept/reject)
router.patch("/:requestId", verifyToken, async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const updated = await RequestForm.findByIdAndUpdate(requestId, { status }, { new: true });
    res.status(200).json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
});
 // DELETE: Remove a request
router.delete("/:requestId", verifyToken, async (req, res) => {
  const { requestId } = req.params;
  try {
    await RequestForm.findByIdAndDelete(requestId);
    res.status(200).json({ success: true, message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete request", error: error.message });
  }
});


module.exports = router;
//  const express = require("express");
// const RequestForm = require("../models/RequestForm");
// const Notification = require("../models/Notification");
// const verifyToken = require("../middleware/verifyToken");
// const router = express.Router();

// // POST: Student sends form request
// router.post("/", verifyToken, async (req, res) => {
//   const { receiverId, title, message, date } = req.body;
//   const { id: senderId, name: senderName } = req.user;

//   if (!receiverId || !title || !message) {
//     return res.status(400).json({ success: false, message: "Missing fields" });
//   }

//   try {
//     const newRequest = new RequestForm({ senderId, senderName, receiverId, title, message, date });
//     const savedRequest = await newRequest.save();

//     const newNotification = new Notification({
//       receiverId,
//       message: `${senderName} sent a function request: "${title}"`,
//       formId: savedRequest._id,
//       type: "function-request"
//     });

//     await newNotification.save();

//     res.status(201).json({ success: true, request: savedRequest });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Request submission failed.", error: error.message });
//   }
// });

// // GET: Fetch form requests for an institute with populated sender name
// router.get("/:instituteId", verifyToken, async (req, res) => {
//   const { instituteId } = req.params;

//   try {
//     const requests = await RequestForm.find({ receiverId: instituteId })
//       .sort({ createdAt: -1 }) // uses built-in timestamps now
//       .populate("senderId", "name"); // populate sender's name field from StudentUser model

//     res.status(200).json({ success: true, requests });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to fetch requests.", error: error.message });
//   }
// });

// // PATCH: Update request status (accept/reject)
// router.patch("/:requestId", verifyToken, async (req, res) => {
//   const { requestId } = req.params;
//   const { status } = req.body;

//   if (!["accepted", "rejected"].includes(status)) {
//     return res.status(400).json({ success: false, message: "Invalid status" });
//   }

//   try {
//     const updated = await RequestForm.findByIdAndUpdate(requestId, { status }, { new: true });
//     res.status(200).json({ success: true, updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
//   }
// });

// module.exports = router;
