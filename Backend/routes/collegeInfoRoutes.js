const express = require('express');
const router = express.Router();
const CollegeDetails = require('../models/CollegeDetails');
const verifyToken = require('../middleware/verifyToken'); // Middleware for token verification

// Submit College Details
router.post('/', verifyToken, async (req, res) => {
  try {
    // Extract the instituteId from the decoded token
    const instituteId = req.user.id;  // Assuming the token contains 'id' field for the institute
    
    // Check if a record already exists for this institute
    const existingRecord = await CollegeDetails.findOne({ instituteId });
    
    if (existingRecord) {
      // Update existing record
      const updatedRecord = await CollegeDetails.findOneAndUpdate(
        { instituteId },
        { ...req.body, instituteId },
        { new: true } // Return the updated document
      );
      return res.status(200).json({ message: 'College details updated successfully!', data: updatedRecord });
    }
    
    // Add the instituteId to the college data before saving
    const collegeData = new CollegeDetails({
      ...req.body,      // Spread the request body to include all other fields
      instituteId      // Add the instituteId here
    });
    
    // Save the college data
    const savedData = await collegeData.save();
    res.status(201).json({ message: 'College details submitted successfully!', data: savedData });
  } catch (error) {
    console.error('Error in POST /:', error);
    res.status(500).json({ message: 'Error submitting college details', error: error.message });
  }
});

// Get All College Details (admin route)
router.get('/', async (req, res) => {
  try {
    // Retrieve all college details from the database
    const collegeDetails = await CollegeDetails.find();
    res.status(200).json(collegeDetails);
  } catch (error) {
    console.error('Error in GET /:', error);
    res.status(500).json({ message: 'Error retrieving college details', error: error.message });
  }
});

// Get College Details by InstituteId (to get only the logged-in institute's college details)
router.get('/institute', verifyToken, async (req, res) => {
  try {
    // Extract the instituteId from the token
    const instituteId = req.user.id;
    console.log('Fetching details for logged-in institute:', instituteId);
    
    // Find and return the college details associated with the logged-in institute
    const collegeDetails = await CollegeDetails.findOne({ instituteId });
    
    if (!collegeDetails) {
      return res.status(404).json({ message: 'No college details found for this institute.' });
    }
    
    res.status(200).json(collegeDetails);
  } catch (error) {
    console.error('Error in GET /institute:', error);
    res.status(500).json({ message: 'Error retrieving college details for this institute', error: error.message });
  }
});

// Get College Details by URL param :instituteId (public route)
router.get('/institute/:instituteId', async (req, res) => {
  try {
    const { instituteId } = req.params;
    console.log('Fetching details for institute with ID:', instituteId);
    
    // Changed from find() to findOne() to get a single document instead of an array
    const collegeDetails = await CollegeDetails.findOne({ instituteId });
    
    if (!collegeDetails) {
      console.log('No college details found for institute ID:', instituteId);
      return res.status(404).json({ message: 'No college details found for this institute.' });
    }
    
    console.log('Successfully found college details');
    res.status(200).json(collegeDetails);
  } catch (error) {
    console.error('Error in GET /institute/:instituteId:', error);
    res.status(500).json({ message: 'Error retrieving college details by instituteId.', error: error.message });
  }
});

module.exports = router;