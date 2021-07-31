// Adib's Code
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      set: setPassword,
    },
    photo: {
      type: String,
      required: false,
      default:
        "https://i1.wp.com/jejuhydrofarms.com/wp-content/uploads/2020/05/blank-profile-picture-973460_1280.png?fit=300%2C300&ssl=1",
    },
    description: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
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
    toJSON: { getters: true },
  }
);

function setPassword(password) {
  return bcrypt.hashSync(password, 10);
}

// If user is deleted, delete all his reviews

userSchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("user", userSchema);
