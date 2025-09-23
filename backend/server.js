import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import meditationRoutes from './routes/meditationRoutes.js';
import breathingRoutes from './routes/breathingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://mindfulchathealthai.vercel.app/' 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true // Atlas requires TLS/SSL
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/meditation', meditationRoutes);
app.use('/api/breathing', breathingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    services: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      ai_service: process.env.AI_SERVICE_URL ? 'configured' : 'not configured'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the MindfulChatHealthAI Backend API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'configured' : 'not configured'}`);
  console.log(`AI Service URL: ${process.env.AI_SERVICE_URL || 'not configured'}`);
});

export default app;