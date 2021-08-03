// Bayu's Code
const express = require("express");

// Import auth
const { admin, user, adminOrUser } = require("../middlewares/auth");

// Import validator
const {
  movieValidator,
  getDetailValidator,
} = require("../middlewares/validators/movies");

// Import controller
const {
  createMovie,
  getAllMovie,
  getDetailMovie,
  updateMovie,
  deleteMovie,
  getMovieByTitle,
  getMovieByGenre,
  getMoviePagination,
} = require("../controllers/movies");

// Router
const router = express.Router();

// Make some routes
router
  .route("/")
  .get(getMoviePagination)
  .get(adminOrUser, getAllMovie)
  .post(admin, movieValidator, createMovie);

router.route("/search").get(getMovieByTitle);
router.route("/genres/:genres").get(getMovieByGenre);
router
  .route("/:id")
  .get(adminOrUser, getDetailValidator, getDetailMovie)
  .put(admin, movieValidator, updateMovie)
  .delete(admin, deleteMovie);

// Exports
module.exports = router;
