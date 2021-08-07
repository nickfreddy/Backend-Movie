// Amri's Code
const express = require("express");

// Import auth
const { user, adminOrUser } = require("../middlewares/auth");

// Import validator
const {
  createOrUpdateReviewValidator,
  deleteReviewValidator,
} = require("../middlewares/validators/reviews");

// Import controller
const {
  createReview,
  getAllReviews,
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
  adminOrUser,
  createOrUpdateReviewValidator,
  updateReview
);
router.delete(
  "/movies/:movie_id/reviews/:id",
  adminOrUser,
  deleteReviewValidator,
  deleteReview
);

// Exports
module.exports = router;
