// Adib's Code
const express = require("express");

// Import auth
const { signup, signin } = require("../middlewares/auth");

// Import validator
const {
  signUpValidator,
  signInValidator,
} = require("../middlewares/validators/auth");

// Import controller
const { getToken } = require("../controllers/auth");

// Make router
const router = express.Router();

// Make routes
router.post("/signup", signUpValidator, signup, getToken);
router.post("/signin", signInValidator, signin, getToken);

// Exports
module.exports = router;
