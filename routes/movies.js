// Bayu's Code
const express = require("express");

// Import auth
const { admin } = require("../middlewares/auth");

// Import validator
const {
  movieValidator,
  getDetailValidator,
  queryValidator,
} = require("../middlewares/validators/movies");

// Import controller
const {
  createMovie,
  getDetailMovie,
  updateMovie,
  deleteMovie,
  getMovieByTitle,
  getMovieByGenre,
  getAllMovieByPage,
} = require("../controllers/movies");

// Router
const router = express.Router();

// Make some routes
router
  .route("/")
  .get(queryValidator, getAllMovieByPage)
  .post(admin, movieValidator, createMovie);

router.route("/search").get(queryValidator, getMovieByTitle);
router.route("/genres/:genres").get(queryValidator, getMovieByGenre);
router
  .route("/:id")
  .get(getDetailValidator, queryValidator, getDetailMovie)
  .put(admin, getDetailValidator, movieValidator, updateMovie)
  .delete(admin, getDetailValidator, deleteMovie);

// Exports
module.exports = router;
