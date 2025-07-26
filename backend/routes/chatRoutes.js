import express from 'express';
import fetch from 'node-fetch';
import ChatSession from '../models/ChatSession.js';
import { detectCrisisKeywords } from '../utils/messageUtils.js';
import { authMiddleware } from './authRoutes.js';
import axios from 'axios';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get chat history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const chatSessions = await ChatSession.find({ userId }).sort({ lastUpdated: -1 });
    res.status(200).json(chatSessions);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent messages for a user
router.get('/message/recent', async (req, res) => {
  try {
    const recentMessages = await ChatSession.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('messages updatedAt');
    
    res.status(200).json(recentMessages);
  } catch (error) {
    console.error('Error fetching recent messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get paginated chat history
router.get('/chats', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const chats = await ChatSession.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ChatSession.countDocuments({ userId: req.user._id });

    res.status(200).json({
      chats,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalChats: total
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process a new message
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let chatSession;
    if (sessionId) {
      chatSession = await ChatSession.findOne({
        _id: sessionId,
        userId: req.user._id
      });
      
      if (!chatSession) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
    } else {
      chatSession = new ChatSession({
        userId: req.user._id,
        messages: []
      });
    }

    // Add user message
    chatSession.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date()
    });

    // Forward message to AI service
    const aiResponse = await axios.post(process.env.AI_SERVICE_URL, {
      message,
      userId: req.user._id,
      timestamp: new Date()
    });

    // Add AI response
    chatSession.messages.push({
      sender: 'bot',
      text: aiResponse.data.response,
      timestamp: new Date()
    });

    chatSession.updatedAt = new Date();
    await chatSession.save();

    res.status(200).json({
      sessionId: chatSession._id,
      messages: chatSession.messages,
      aiResponse: aiResponse.data
    });
  } catch (error) {
    console.error('Error processing message:', error);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// End a chat session
router.post('/end-session', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const chatSession = await ChatSession.findById(sessionId);
    
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    chatSession.isActive = false;
    await chatSession.save();
    
    res.status(200).json({ message: 'Chat session ended successfully' });
  } catch (error) {
    console.error('Error ending chat session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific chat session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const chatSession = await ChatSession.findOne({
      _id: req.params.sessionId,
      userId: req.user._id
    });

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.status(200).json(chatSession);
  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;