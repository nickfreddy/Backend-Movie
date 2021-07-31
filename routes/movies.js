// Bayu's Code
const express = require("express");

// Import auth
const { admin } = require("../middlewares/auth");

// Import validator
const { movieValidator } = require("../middlewares/validators/movies");

// Import controller
const {
  createMovie,
  getAllMovie,
  getDetailMovie,
  updateMovie,
  deleteMovie,
  getMovieByCategory,
} = require("../controllers/movies");

// Router
const router = express.Router();

// Make some routes
router.route("/movies").get(getAllMovie).post(movieValidator, createMovie);
router
  .route("/movie/:id")
  .get(getDetailMovie)
  .put(updateMovie)
  .delete(deleteMovie);
router.route("/movie/:genres").get(getMovieByCategory);

// Exports
module.exports = router;
