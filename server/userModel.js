const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 1,
      max: 32,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 10000,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 128,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    rating: {
      type: String,
      default: "unranked",
    },
    startedTests: {
      type: Number,
      default: 0,
    },
    endedTests: {
      type: Number,
      default: 0,
    },
    typingTime: {
      type: Number,
      default: 0,
    },
    friends: {
      type: Array,
      default: [],
    },
    friendRequests: {
      type: Array,
      default: [],
    },
    // wpm, accuracy, raw, consistency
    avgStats: {
      type: Array,
      // all times / month / week / day
      default: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    },
    // wpm, raw
    topStats: {
      type: Array,
      // all times / month / week / day
      default: [[0, 0, 0, 0], [0, 0, 0, 0]],
    },
    nationality: {
      type: String,
      default: "",
    },
    created: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);