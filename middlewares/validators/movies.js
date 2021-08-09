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
    /* istanbul ignore next */
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

    const genreArray = ["action", "romance", "comedy", "anime"];
    const data = req.body.genres.split(", ");
    data.forEach((genre) => {
      let valid = true;
      if (!genreArray.includes(genre)) {
        valid = false;
      }
      if (valid === false) {
        errorMessages.push("Invalid genre(s)");
      }
    });

    if (req.body.release_year) {
      if (
        !validator.isInt(req.body.release_year) ||
        req.body.release_year.length != 4
      ) {
        errorMessages.push(
          "Year is not valid! Please using number only and with format YYYY"
        );
      }
    }
    if (!validator.isURL(req.body.trailer)) {
      errorMessages.push("URL is not valid");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.queryValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (req.query.page) {
      if (!validator.isInt(req.query.page)) {
        errorMessages.push("Page request must be number");
      }
    }
    if (req.query.limit) {
      if (!validator.isInt(req.query.limit)) {
        errorMessages.push("Limit request must be number");
      }
    }
    if (req.query.revpage) {
      if (!validator.isInt(req.query.revpage)) {
        errorMessages.push("Review request page must be number");
      }
    }
    if (req.query.revlimit) {
      if (!validator.isInt(req.query.revlimit)) {
        errorMessages.push("Review request limit must be number");
      }
    }

    if (errorMessages.length > 0) {
      return next({ statusCode: 400, messages: errorMessages });
    }

    next();
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};
