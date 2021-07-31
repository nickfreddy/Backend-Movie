// Adib's Code

// create => same as auth register
// read => check if username exists
// update => check if the updater is the same user, or admin
// delete => check if deleter is the same user, or admin

const validator = require("validator");
const mongoose = require("mongoose");
const { good, customer } = require("../../models");

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

exports.createOrUpdateUserValidator = async (req, res, next) => {
  try {
    /* Validate the user input */
    const errorMessages = [];

    if (!validator.isLength(req.body.name, { min: 1, max: undefined })) {
      errorMessages.push("name cannot be empty");
    }

    if (!validator.isEmail(req.body.email)) {
      errorMessages.push("email cannot be empty");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
