const mongoose = require("mongoose")

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
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
    index: true,
  },
})

const MoodEntry = mongoose.model("MoodEntry", moodEntrySchema)

module.exports = MoodEntry
