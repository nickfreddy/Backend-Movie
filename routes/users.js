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
router.get("/:id", admin, getDetailValidator, getDetailUser);
router.put("/:id", createOrUpdateUserValidator, updateUser);
router.delete("/:id", deleteUser);

// Exports
module.exports = router;
