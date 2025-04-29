// const express = require('express');
// const router = express.Router();
// const CollegeDetails = require('../models/CollegeDetails');
// const verifyToken = require('../middleware/verifyToken'); // Middleware for token verification

// // Submit College Details
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const collegeData = new CollegeDetails(req.body);
//     await collegeData.save();
//     res.status(201).json({ message: 'College details submitted successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error submitting college details' });
//   }
// });

// // Get College Details (If needed)
// router.get('/', async (req, res) => {
//   try {
//     const collegeDetails = await CollegeDetails.find();
//     res.status(200).json(collegeDetails);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error retrieving college details' });
//   }
// });


// module.exports = router;
const express = require('express');
const router = express.Router();
const CollegeDetails = require('../models/CollegeDetails');
const verifyToken = require('../middleware/verifyToken'); // Middleware for token verification

// Submit College Details
router.post('/', verifyToken, async (req, res) => {
  try {
    // Extract the instituteId from the decoded token
    const instituteId = req.user.id;  // Assuming the token contains 'id' field for the institute

    // Add the instituteId to the college data before saving
    const collegeData = new CollegeDetails({
      ...req.body,      // Spread the request body to include all other fields
      instituteId      // Add the instituteId here
    });

    // Save the college data
    await collegeData.save();
    res.status(201).json({ message: 'College details submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting college details' });
  }
});

// Get College Details (If needed)
router.get('/', async (req, res) => {
  try {
    // Retrieve college details from the database
    const collegeDetails = await CollegeDetails.find();
    res.status(200).json(collegeDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving college details' });
  }
});

// Get College Details by InstituteId (to get only the logged-in institute's college details)
router.get('/institute', verifyToken, async (req, res) => {
  try {
    // Extract the instituteId from the token
    const instituteId = req.user.id;

    // Find and return the college details associated with the logged-in institute
    const collegeDetails = await CollegeDetails.find({ instituteId });
    res.status(200).json(collegeDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving college details for this institute' });
  }
});

module.exports = router;
