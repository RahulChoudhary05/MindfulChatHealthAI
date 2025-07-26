const mongoose = require("mongoose")

const interactionLogSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: ["positive", "negative", "neutral", "unknown"],
    default: "unknown",
    index: true,
  },
  isCrisis: {
    type: Boolean,
    default: false,
    index: true,
  },
  emotions: {
    type: Object,
    default: {},
  },
  keywords: {
    type: [String],
    default: [],
  },
  chart: {
    type: Object,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
})

// Create text indexes for search
interactionLogSchema.index({ message: "text", response: "text" })

const InteractionLog = mongoose.model("InteractionLog", interactionLogSchema)

module.exports = InteractionLog
