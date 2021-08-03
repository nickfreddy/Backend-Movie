// Amri's Code

// A user cannot create multiple reviews for the same movie
// Amri's Code

// A user cannot create multiple reviews for the same movie
const validator = require("validator");
const mongoose = require("mongoose");
const { movie, user } = require("../../models");

exports.getDetailValidator = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({ message: "review id is not valid", statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateReviewValidator = async (req, res, next) => {
  try {
    /* Validate the user input */
    const errorMessages = [];

    if (!mongoose.Types.ObjectId.isValid(req.params.movie_id)) {
      errorMessages.push("movie is not valid");
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.user)) {
      errorMessages.push("user is not valid");
    }

    if (!validator.isLength(req.body.comment, { min: 1, max: undefined })) {
      errorMessages.push("comment cannot be empty");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
