// Adib's Code

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

exports.createOrUpdateUserValidator = async (req, res, next) => {
  try {
    /* Validate the user input */
    const errorMessages = [];

    if (req.body.username === "") {
      errorMessages.push("name cannot be empty");
    }

    if (req.body.email) {
      if (!validator.isEmail(req.body.email)) {
        errorMessages.push("email is not valid");
      }
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};
