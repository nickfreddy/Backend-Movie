// Adib's Code
const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// Import auth
const { adminOrSameUser } = require("../middlewares/auth");

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

router.put(
  "/:id",
  adminOrSameUser,
  createOrUpdateUserValidator,
  upload.single("photo"),
  updateUser
);

router.delete("/:id", adminOrSameUser, deleteUser);

// Exports
module.exports = router;
