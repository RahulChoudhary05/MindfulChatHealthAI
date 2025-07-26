import express from 'express';
import MeditationSession from '../models/MeditationSession.js';
import { authMiddleware } from './authRoutes.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all meditation sessions for a user
router.get('/', async (req, res) => {
  try {
    const sessions = await MeditationSession.find({ userId: req.user._id })
      .sort({ startedAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching meditation sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific meditation session
router.get('/:id', async (req, res) => {
  try {
    const session = await MeditationSession.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Meditation session not found' });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching meditation session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new meditation session
router.post('/', async (req, res) => {
  try {
    const { type, duration, title, description, audioUrl, moodBefore } = req.body;
    
    // Validate required fields
    if (!type || !duration || !title) {
      return res.status(400).json({ 
        message: 'Type, duration, and title are required',
        details: {
          type: !type ? 'Type is required' : null,
          duration: !duration ? 'Duration is required' : null,
          title: !title ? 'Title is required' : null
        }
      });
    }
    
    // Validate type
    if (!['guided', 'unguided', 'music', 'nature'].includes(type)) {
      return res.status(400).json({ message: 'Invalid meditation type' });
    }
    
    // Validate duration
    if (duration < 1 || duration > 120) {
      return res.status(400).json({ message: 'Duration must be between 1 and 120 minutes' });
    }
    
    // Create new session
    const session = new MeditationSession({
      userId: req.user._id,
      type,
      duration,
      title,
      description,
      audioUrl,
      moodBefore,
      startedAt: new Date()
    });
    
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating meditation session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a meditation session
router.put('/:id', async (req, res) => {
  try {
    const { completed, notes, moodAfter } = req.body;
    
    const session = await MeditationSession.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Meditation session not found' });
    }
    
    if (completed !== undefined) {
      session.completed = completed;
      if (completed) {
        session.completedAt = new Date();
      }
    }
    if (notes !== undefined) session.notes = notes;
    if (moodAfter !== undefined) session.moodAfter = moodAfter;
    
    await session.save();
    res.status(200).json(session);
  } catch (error) {
    console.error('Error updating meditation session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a meditation session
router.delete('/:id', async (req, res) => {
  try {
    const session = await MeditationSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Meditation session not found' });
    }
    
    res.status(200).json({ message: 'Meditation session deleted successfully' });
  } catch (error) {
    console.error('Error deleting meditation session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 