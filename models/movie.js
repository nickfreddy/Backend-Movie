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
      required: true,
    },
    release_year: {
      type: String,
      required: false,
      default: 0,
    },
    poster: {
      type: String,
      required: false,
      default:
        "https://www.seekpng.com/png/detail/187-1870041_all-these-anonymous-startups-are-interesting-anonymous-logo.png",
    },
    trailer: {
      type: String,
      required: false,
      default: "https://www.youtube.com/watch?v=htqXL94Rza4",
    },
    synopsis: {
      type: String,
      required: true,
    },
    averageRating: {
      type: mongoose.Schema.Types.Number,
      required: false,
      default: null,
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

movieSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("movie", movieSchema);
