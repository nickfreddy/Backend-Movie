// Amri's Code
const validator = require("validator");
const mongoose = require("mongoose");
const { review, user } = require("../../models");

exports.createOrUpdateReviewValidator = async (req, res, next) => {
  try {
    const authorizeds = await user.find({ role: "admin" }).select("_id");

    const data = authorizeds.map((entry) => entry._id.toString());

    // For updating reviews, supply review id
    if (req.params.id) {
      const author = await review
        .findById(req.params.id)
        .select("-_id user_id");
      data.push(author.user_id.toString());
      console.log({ data });
    }

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

    if (!validator.isInt(req.body.rating, { min: 1, max: 5 })) {
      errorMessages.push("rating cannot be empty or more than 5");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    // For updating reviews, check if admin or users
    if (req.params.id && !data.includes(req.user.user)) {
      return next({ messages: "Unauthorized user", statusCode: 401 });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteReviewValidator = async (req, res, next) => {
  try {
    // Check if admin or author of review is deleting
    const authorizeds = await user.find({ role: "admin" }).select("_id");
    const data = authorizeds.map((entry) => entry._id.toString());

    if (req.params.id) {
      const author = await review
        .findById(req.params.id)
        .select("-_id user_id");
      data.push(author.user_id.toString());
      console.log({ data });
    }

    if (req.params.id && !data.includes(req.user.user)) {
      return next({ messages: "Unauthorized user", statusCode: 401 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
