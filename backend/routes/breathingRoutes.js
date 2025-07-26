import express from 'express';
import BreathingSession from '../models/BreathingSession.js';
import { authMiddleware } from './authRoutes.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all breathing sessions for a user
router.get('/', async (req, res) => {
  try {
    const sessions = await BreathingSession.find({ userId: req.user._id })
      .sort({ startedAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching breathing sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific breathing session
router.get('/:id', async (req, res) => {
  try {
    const session = await BreathingSession.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Breathing session not found' });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching breathing session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new breathing session
router.post('/', async (req, res) => {
  try {
    const { type, duration, inhaleTime, holdTime, exhaleTime, cycles, title, description, moodBefore } = req.body;
    
    // Validate required fields
    if (!type || !duration || !inhaleTime || !exhaleTime || !cycles) {
      return res.status(400).json({ 
        message: 'Type, duration, inhale time, exhale time, and cycles are required',
        details: {
          type: !type ? 'Type is required' : null,
          duration: !duration ? 'Duration is required' : null,
          inhaleTime: !inhaleTime ? 'Inhale time is required' : null,
          exhaleTime: !exhaleTime ? 'Exhale time is required' : null,
          cycles: !cycles ? 'Cycles are required' : null
        }
      });
    }
    
    // Validate type
    if (!['box', '4-7-8', 'alternate-nostril', 'deep', 'custom'].includes(type)) {
      return res.status(400).json({ message: 'Invalid breathing type' });
    }
    
    // Validate duration
    if (duration < 1 || duration > 30) {
      return res.status(400).json({ message: 'Duration must be between 1 and 30 minutes' });
    }
    
    // Validate times
    if (inhaleTime < 1 || inhaleTime > 20) {
      return res.status(400).json({ message: 'Inhale time must be between 1 and 20 seconds' });
    }
    if (holdTime && (holdTime < 0 || holdTime > 20)) {
      return res.status(400).json({ message: 'Hold time must be between 0 and 20 seconds' });
    }
    if (exhaleTime < 1 || exhaleTime > 20) {
      return res.status(400).json({ message: 'Exhale time must be between 1 and 20 seconds' });
    }
    
    // Validate cycles
    if (cycles < 1 || cycles > 100) {
      return res.status(400).json({ message: 'Cycles must be between 1 and 100' });
    }
    
    // Create new session
    const session = new BreathingSession({
      userId: req.user._id,
      type,
      duration,
      inhaleTime,
      holdTime,
      exhaleTime,
      cycles,
      title: title || `${type} Breathing Exercise`,
      description,
      moodBefore,
      startedAt: new Date()
    });
    
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating breathing session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a breathing session
router.put('/:id', async (req, res) => {
  try {
    const { completed, notes, moodAfter } = req.body;
    
    const session = await BreathingSession.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Breathing session not found' });
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
    console.error('Error updating breathing session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a breathing session
router.delete('/:id', async (req, res) => {
  try {
    const session = await BreathingSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Breathing session not found' });
    }
    
    res.status(200).json({ message: 'Breathing session deleted successfully' });
  } catch (error) {
    console.error('Error deleting breathing session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 