const mongoose = require("mongoose")

const breathingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  pattern: {
    type: String,
    required: true,
  },
  cycles: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
})

const BreathingSession = mongoose.model("BreathingSession", breathingSessionSchema)

module.exports = BreathingSession
