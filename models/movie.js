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
        "https://res.cloudinary.com/pandjibay99/image/upload/v1628009341/DMovie/Default_rzn6o6.jpg",
    },
    trailer: {
      type: String,
      required: false,
      default: "https://www.youtube.com",
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
    reviews: [
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
    // toJSON: { getters: true, versionKey: false },
  }
);

movieSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("movie", movieSchema);
