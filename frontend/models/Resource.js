const mongoose = require("mongoose")

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Article", "Video", "Exercise", "Guide", "Crisis Support", "Tool", "App"],
    required: true,
    index: true,
  },
  category: {
    type: String,
    enum: ["Anxiety", "Depression", "Stress", "Mindfulness", "Sleep", "Self-Care", "Crisis", "General"],
    required: true,
    index: true,
  },
  url: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create text indexes for search
resourceSchema.index({ title: "text", description: "text", tags: "text" })

const Resource = mongoose.model("Resource", resourceSchema)

module.exports = Resource
