// Amri's Code
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const ReviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Please add a some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Please add rating between 1 and 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  movie_id: {
    type: mongoose.Schema.ObjectId,
    ref: "movie",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
});

// Prevent user for submitting more than one review per movie
ReviewSchema.index({ movie: 1, user: 1 }, { unique: true });

// Static method to get averaga rating
ReviewSchema.statics.getAverageRating = async function (movieId) {
  const obj = await this.aggregate([
    {
      $match: { movie: movieId },
    },
    {
      $group: {
        _id: "$movie",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("movie").findByIdAndUpdate(movieId, {
      averageRating: obj[0].averageRating,
    });
  } catch (e) {
    console.error(e);
  }
};

// call getAverageCost after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.movie);
});

// call getAverageCost after remove
ReviewSchema.post("remove", function () {
  this.constructor.getAverageRating(this.movie);
});

module.exports = mongoose.model("review", ReviewSchema);
