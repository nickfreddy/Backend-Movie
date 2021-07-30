const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: [
      { type: mongoose.Schema.Types.ObjectId, require: true, ref: "category" },
    ],
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
      type: mongoose.Schema.Types.ObjectId, // Movie should be float. Movie rating must have default until we get enough review ratings.
      ref: "rating",
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "review" }],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toJSON: { getters: true },
  }
);

function getPoster(poster) {
  if (!poster || poster.includes("https") || poster.includes("http")) {
    return poster;
  }

  return `/images/poster/${poster}`;
}

module.exports = mongoose.model("movie", movieSchema);
