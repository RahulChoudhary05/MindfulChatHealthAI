import express from 'express';
import JournalEntry from '../models/JournalEntry.js';
import { authMiddleware } from './authRoutes.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all journal entries for a user
router.get('/', async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific journal entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    res.status(200).json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new journal entry
router.post('/', async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    
    if (!title || !content || !mood) {
      return res.status(400).json({ 
        message: 'Title, content, and mood are required' 
      });
    }
    
    const entry = new JournalEntry({
      userId: req.user._id,
      title,
      content,
      mood,
      tags: tags || []
    });
    
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a journal entry
router.put('/:id', async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    if (title) entry.title = title;
    if (content) entry.content = content;
    if (mood) entry.mood = mood;
    if (tags) entry.tags = tags;
    
    await entry.save();
    res.status(200).json(entry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a journal entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    res.status(200).json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 