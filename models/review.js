// Amri's Code
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const reviewSchema = new mongoose.Schema(
  // Column
  {
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "movie",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
  },
  // Options
  {
    // Enable timestamps
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Enable soft delete, it will make delete column automaticly
reviewSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Export model
module.exports = mongoose.model("review", reviewSchema);
