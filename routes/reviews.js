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
  getAllReviews,
  getDetailReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

// Make router
// const router = express.Router();
const router = express.Router({ mergeParams: true });

// Make some routes
router.post(
  "/movies/:movie_id/reviews",
  user,
  createOrUpdateReviewValidator,
  createReview
);
router.get("/reviews", getAllReviews);

// router.get("/:id", getDetailValidator, getDetailReview);
router.put(
  "/movies/:movie_id/reviews/:id",
  user,
  createOrUpdateReviewValidator,
  updateReview
);
router.delete("/movies/:movie_id/reviews/:id", adminOrUser, deleteReview);

// Exports
module.exports = router;
