// Adib's Code
const express = require("express");

// Import auth
const { register, signin } = require("../middlewares/auth");

// Import validator
const {
  registerValidator,
  signInValidator,
} = require("../middlewares/validators/auth");

// Import controller
const { getToken } = require("../controllers/auth");

// Make router
const router = express.Router();

// Make routes
router.post("/register", registerValidator, register, getToken);
router.post("/signin", signInValidator, signin, getToken);

// Exports
module.exports = router;
