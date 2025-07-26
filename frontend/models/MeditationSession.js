const mongoose = require("mongoose")

const meditationSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  sound: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
})

const MeditationSession = mongoose.model("MeditationSession", meditationSessionSchema)

module.exports = MeditationSession
