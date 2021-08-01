// Bayu's Code
const validator = require("validator");
const mongoose = require("mongoose");

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

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }
  } catch (error) {
    next(error);
  }
};
