const mongoose = require("mongoose")

const sessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  lastInteractionTime: {
    type: Date,
    default: Date.now,
  },
  interactionCount: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
  },
})

const Session = mongoose.model("Session", sessionSchema)

module.exports = Session