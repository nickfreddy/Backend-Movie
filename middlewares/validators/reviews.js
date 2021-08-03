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

    if (!mongoose.Types.ObjectId.isValid(req.body.movie)) {
      errorMessages.push("movie is not valid");
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.user)) {
      errorMessages.push("user is not valid");
    }

    if (!validator.isLength(req.body.comment, { min: 1, max: undefined })) {
      errorMessages.push("comment cannot be empty");
    }

    if (req.body.rating > 5) {
      errorMessages.push("Rating not more than 5 stars");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    /* Find user and movie is exist or not */
    const data = await Promise.all([
      movie.findOne({ _id: req.body.movie }),
      user.findOne({ _id: req.body.user }),
    ]);

    if (!data[0] || !data[1]) {
      errorMessages.push("movie or user not found");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
