// Amri's Code
const express = require("express");

// Import auth
const { admin, user } = require("../middlewares/auth");

// Import validator
const {
  createOrUpdateReviewValidator,
  getDetailReview,
} = require("../middlewares/validators/review");

// Import controller
const {
  createReview,
  getAllReview,
  getDetailReview,
  updateReview,
  deleteReview,
} = require("../controllers/review");

// Make router
const router = express.Router();

// Make some routes
router.post("/", createOrUpdateReviewValidator, createReview);
router.get("/", getAllReview);

router.get("/:id", getDetailReview, getDetailReview);
router.put("/:id", createOrUpdateReviewValidator, updateReview);
router.delete("/:id", deleteReview);

// Exports
module.exports = router;
