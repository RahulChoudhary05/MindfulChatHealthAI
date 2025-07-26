import mongoose from 'mongoose';

const meditationSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['guided', 'unguided', 'music', 'nature'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1,
    max: 120
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  audioUrl: {
    type: String,
    trim: true
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

const MeditationSession = mongoose.model('MeditationSession', meditationSessionSchema);

export default MeditationSession; 