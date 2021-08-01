// Bayu's Code
const express = require("express");

// Import auth
const { admin, user, adminOrUser } = require("../middlewares/auth");

// Import validator
const {
  getDetailValidator,
  movieValidator,
  updateMovieValidator,
} = require("../middlewares/validators/movies");

// Import controller
const {
  createMovie,
  getAllMovie,
  getDetailMovie,
  updateMovie,
  deleteMovie,
  getMovieByTitle,
} = require("../controllers/movies");

// Router
const router = express.Router();

// Make some routes
router
  .route("/movies")
  .get(getAllMovie)
  .post(/* movieValidator ,*/ createMovie);

router
  .route("/movie/:id")
  .get(/* getDetailValidator ,*/ getDetailMovie)
  .put(/* movieValidator, updateMovieValidator, */ updateMovie)
  .delete(deleteMovie);
router.route("/movie/:title").get(getMovieByTitle);

// Exports
module.exports = router;
