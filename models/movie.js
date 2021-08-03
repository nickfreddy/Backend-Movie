const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genres: {
      type: [String],
      enum: ["action", "romance", "comedy", "anime"],
    },
    release_year: {
      type: String,
      required: false,
    },
    poster: {
      type: String,
      required: false,
      get: getPoster,
    },
    trailer: {
      type: String,
      required: false,
    },
    synopsis: {
      type: String,
      required: true,
    },
    rating: {
      type: mongoose.Schema.Types.Number,
      default: 0,
      // get: getRating,
    },
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toObject: { getters: true },
    toJSON: { getters: true, versionKey: false },
  }
);

// function getRating(rate) {
//   return Math.round(10 / (rate * 10));
// }

function getPoster(poster) {
  if (!poster || poster.includes("https") || poster.includes("http")) {
    return poster;
  }

  return `/images/poster/${poster}`;
}

movieSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("movie", movieSchema);
