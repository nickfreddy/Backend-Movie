// Bayu's Code
const validator = require("validator");
const mongoose = require("mongoose");
const movie = require("../../models/movie");

exports.getDetailValidator = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({ message: "id is not valid", statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.movieValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (validator.isEmpty(req.body.title)) {
      errorMessages.push("Title cannot be empty!");
    }

    if (validator.isEmpty(req.body.synopsis)) {
      errorMessages.push("Synopsis cannot be empty!");
    }

    if (
      !validator.isInt(req.body.release_year) ||
      req.body.release_year.length != 4
    ) {
      errorMessages.push(
        "Year is not valid! Please using number only and with format YYYY"
      );
    }

    if (!validator.isURL(req.body.trailer)) {
      errorMessages.push("URL is not valid");
    }

    if (!validator.isInt(req.body.rating)) {
      errorMessages.push("Rating is not valid! Please using number only");
    }

    if (req.body.rating > 10) {
      errorMessages.push("Rating must be lesser than 10");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateMovieValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    const dataMovie = await movie.findById(req.params.id);
    if (!dataMovie) {
      errorMessages.push("Movie not found!");
    }
  } catch (error) {
    next(error);
  }
};
