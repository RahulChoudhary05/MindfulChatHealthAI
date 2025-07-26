import express from 'express';
import { authMiddleware } from './authRoutes.js';
import User from '../models/User.js';
import JournalEntry from '../models/JournalEntry.js';
import MeditationSession from '../models/MeditationSession.js';
import BreathingSession from '../models/BreathingSession.js';
import ChatSession from '../models/ChatSession.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Register a new user (anonymous)
router.post('/register', async (req, res) => {
  try {
    const { deviceId } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ deviceId });
    
    if (user) {
      return res.status(200).json({ userId: user._id, message: 'User already exists' });
    }
    
    // Create new anonymous user
    user = new User({
      deviceId,
      isAnonymous: true
    });
    
    await user.save();
    
    res.status(201).json({ userId: user._id, message: 'Anonymous user created successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user preferences
router.get('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ preferences: user.preferences });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;
    
    if (!preferences) {
      return res.status(400).json({ message: 'Preferences are required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.preferences = { ...user.preferences, ...preferences };
    await user.save();
    
    res.status(200).json({ message: 'Preferences updated successfully', preferences: user.preferences });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -deviceId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, email, preferences, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Handle password change if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Update password
      user.password = newPassword;
    }
    
    // Update other fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already in use' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Delete user account
router.delete('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.deleteOne();
    
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get counts from different collections
    const [journalCount, meditationCount, breathingCount, chatCount] = await Promise.all([
      JournalEntry.countDocuments({ userId }),
      MeditationSession.countDocuments({ userId }),
      BreathingSession.countDocuments({ userId }),
      ChatSession.countDocuments({ userId })
    ]);
    
    // Get mood distribution from journal entries
    const moodDistribution = await JournalEntry.aggregate([
      { $match: { userId } },
      { $group: { _id: '$mood', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      journalCount,
      meditationCount,
      breathingCount,
      chatCount,
      moodDistribution: moodDistribution.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;