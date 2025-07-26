const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      min: 6,
      max: 100,
    },
    socialLogins: [
      {
        provider: {
          type: String,
          enum: ["google", "facebook", "github"],
        },
        providerId: {
          type: String,
        },
      },
    ],
    moodEntries: [
      {
        emotion: {
          type: String,
          required: true,
        },
        note: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
    },
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        default: "teal",
      },
      language: {
        type: String,
        default: "English",
      },
    },
  },
  { timestamps: true },
)

const User = mongoose.model("User", userSchema)

module.exports = User
