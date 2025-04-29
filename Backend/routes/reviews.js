const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// POST: Submit or Update Review
router.post("/submit", async (req, res) => {
    try {
      console.log("Received review submission:", req.body);
      const { reviewText, starRating, userName, institute } = req.body;

      if (!reviewText || !starRating || !institute) {
        console.log("Missing required fields:", {
          reviewText: !!reviewText,
          starRating: !!starRating,
          institute: !!institute
        });
        return res.status(400).json({ message: "Review text, star rating, and institute are required." });
      }

      // For institute users, use institute name if userName not provided
      const reviewerName = userName || req.body.instituteName;
      if (!reviewerName) {
        return res.status(400).json({ message: "Reviewer name is required." });
      }

    // Check if a review already exists
    const existingReview = await Review.findOne({ 
      $or: [
        { userName, institute },
        { userName: reviewerName, institute }
      ]
    });
    if (existingReview) {
      existingReview.reviewText = reviewText;
      existingReview.starRating = starRating;
      existingReview.createdAt = new Date();
      const updatedReview = await existingReview.save();
      return res.status(200).json(updatedReview);
    }

    // Create a new review
    const newReview = new Review({
      reviewText,
      starRating,
      userName: reviewerName,
      institute,
      createdAt: new Date(),
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Failed to save review", error });
  }
});

// GET: Fetch reviews for a specific institute
router.get("/:instituteId", async (req, res) => {
  try {
    const reviews = await Review.find({ institute: req.params.instituteId })
      .populate("institute", "name");

    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this institute." });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews.", error });
  }
});

// GET: Fetch all reviews (Paginated)
router.get("/all", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reviews = await Review.find()
      .populate("institute", "name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Failed to fetch all reviews.", error });
  }
});

module.exports = router;
