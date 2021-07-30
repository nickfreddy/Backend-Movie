// Amri's Code
const express = require("express");

// Import auth
const { admin, user, adminOrUser } = require("../middlewares/auth");

// Import validator
const {
  createOrUpdateReviewValidator,
  getDetailValidator,
} = require("../middlewares/validators/reviews");

// Import controller
const {
  createReview,
  getAllReview,
  getDetailReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

// Make router
const router = express.Router();

// Make some routes
router.post("/", createOrUpdateReviewValidator, createReview);
router.get("/", getAllReview);

router.get("/:id", getDetailValidator, getDetailReview);
router.put("/:id", createOrUpdateReviewValidator, updateReview);
router.delete("/:id", deleteReview);

// Exports
module.exports = router;
