// Adib's Code
const express = require("express");

// Import auth
const { admin, user, adminOrUser } = require("../middlewares/auth");

// Import validator
const {
  createOrUpdateUserValidator,
  getDetailValidator,
} = require("../middlewares/validators/users");

// Import controller
const {
  getDetailUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

// Make router
const router = express.Router();

// Make some routes
router.get("/:id", getDetailValidator, getDetailUser);
router.put("/:id", createOrUpdateUserValidator, updateUser); // missing isSameUser validator
router.delete("/:id", deleteUser); // missing isSameUser validator

// Exports
module.exports = router;
