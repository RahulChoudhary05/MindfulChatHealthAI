import mongoose from 'mongoose';

const breathingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['box', '4-7-8', 'alternate-nostril', 'deep', 'custom'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1,
    max: 30
  },
  inhaleTime: {
    type: Number, // in seconds
    required: true,
    min: 1,
    max: 20
  },
  holdTime: {
    type: Number, // in seconds
    min: 0,
    max: 20
  },
  exhaleTime: {
    type: Number, // in seconds
    required: true,
    min: 1,
    max: 20
  },
  cycles: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  moodBefore: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'neutral']
  },
  moodAfter: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'neutral']
  }
});

const BreathingSession = mongoose.model('BreathingSession', breathingSessionSchema);

export default BreathingSession; 