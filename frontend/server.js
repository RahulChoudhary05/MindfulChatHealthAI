const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const { v4: uuidv4 } = require("uuid")
const axios = require("axios")
const path = require("path")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Load environment variables
dotenv.config()

// Import models
const InteractionLog = require("./models/InteractionLog")
const Session = require("./models/Session")
const Resource = require("./models/Resource")
const User = require("./models/User")
const JournalEntry = require("./models/JournalEntry")
const MeditationSession = require("./models/MeditationSession")
const BreathingSession = require("./models/BreathingSession")
const MoodEntry = require("./models/MoodEntry")

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(
  cors({
    origin: ["http://localhost:4001", "http://localhost:3000"],
    credentials: true,
  }),
)
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/MindfulChat ", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) return res.status(401).json({ error: "Access denied" })

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "MindfulChat -secret-key")
    req.user = verified
    next()
  } catch (error) {
    res.status(400).json({ error: "Invalid token" })
  }
}

// Optional authentication middleware - doesn't require auth but uses it if available
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token) {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET || "MindfulChat -secret-key")
      req.user = verified
    } catch (error) {
      // Invalid token, but we'll continue anyway
      console.warn("Invalid token provided, continuing as guest")
    }
  }
  next()
}

// API Routes

// User registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    // Save user to database
    const savedUser = await user.save()

    // Create JWT token
    const token = jwt.sign(
      { id: savedUser._id, name: savedUser.name, email: savedUser.email },
      process.env.JWT_SECRET || "MindfulChat -secret-key",
      { expiresIn: "7d" },
    )

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    })
  } catch (error) {
    console.error("Error registering user:", error)
    res.status(500).json({ message: "Failed to register user" })
  }
})

// User login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "MindfulChat -secret-key",
      { expiresIn: "7d" },
    )

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error logging in:", error)
    res.status(500).json({ message: "Failed to login" })
  }
})

// Social login/signup
app.post("/api/auth/social", async (req, res) => {
  try {
    const { name, email, provider, providerId } = req.body

    // Check if user exists
    let user = await User.findOne({ email })

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        socialLogins: [{ provider, providerId }],
      })

      await user.save()
    } else {
      // Update social login info if needed
      const socialLoginExists = user.socialLogins.some((login) => login.provider === provider)
      if (!socialLoginExists) {
        user.socialLogins.push({ provider, providerId })
        await user.save()
      }
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "MindfulChat -secret-key",
      { expiresIn: "7d" },
    )

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error with social login:", error)
    res.status(500).json({ message: "Failed to authenticate with social provider" })
  }
})

// Get user profile
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ message: "Failed to fetch user profile" })
  }
})

// Update user profile
app.put("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const { name, bio, preferences } = req.body

    // Find user
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields
    if (name) user.name = name
    if (bio !== undefined) user.bio = bio
    if (preferences) user.preferences = { ...user.preferences, ...preferences }

    await user.save()

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      preferences: user.preferences,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({ message: "Failed to update profile" })
  }
})

// Change password
app.put("/api/user/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Find user
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check current password
    const validPassword = await bcrypt.compare(currentPassword, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword

    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    res.status(500).json({ message: "Failed to change password" })
  }
})

// Upload avatar
app.post("/api/user/upload-avatar", authenticateToken, async (req, res) => {
  try {
    // In a real app, you would handle file upload here
    // For this example, we'll just update the avatar URL
    const avatarUrl = req.body.avatarUrl || "/placeholder.svg"

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.avatar = avatarUrl
    await user.save()

    res.json({ avatarUrl })
  } catch (error) {
    console.error("Error uploading avatar:", error)
    res.status(500).json({ message: "Failed to upload avatar" })
  }
})

// Delete user account
app.delete("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Delete user and all associated data
    await User.findByIdAndDelete(userId)
    await Session.deleteMany({ userId })
    await InteractionLog.deleteMany({ userId })
    await JournalEntry.deleteMany({ userId })
    await MeditationSession.deleteMany({ userId })
    await BreathingSession.deleteMany({ userId })
    await MoodEntry.deleteMany({ userId })

    res.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    res.status(500).json({ message: "Failed to delete account" })
  }
})

// Get user stats
app.get("/api/user/stats", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Get meditation minutes
    const meditationSessions = await MeditationSession.find({ userId })
    const meditationMinutes = meditationSessions.reduce((total, session) => total + session.duration, 0)

    // Get journal entries count
    const journalEntries = await JournalEntry.countDocuments({ userId })

    // Get breathing exercises count
    const breathingExercises = await BreathingSession.countDocuments({ userId })

    // Get chat interactions count
    const chatInteractions = await InteractionLog.countDocuments({ userId })

    // Get recent activities
    const recentActivities = []

    // Get recent meditation sessions
    const recentMeditations = await MeditationSession.find({ userId }).sort({ createdAt: -1 }).limit(3)

    recentMeditations.forEach((session) => {
      recentActivities.push({
        type: "meditation",
        description: `Completed a ${session.duration}-minute meditation session`,
        timestamp: session.createdAt,
      })
    })

    // Get recent journal entries
    const recentJournals = await JournalEntry.find({ userId }).sort({ createdAt: -1 }).limit(3)

    recentJournals.forEach((entry) => {
      recentActivities.push({
        type: "journal",
        description: `Added a new journal entry: "${entry.title || "Untitled"}"`,
        timestamp: entry.createdAt,
      })
    })

    // Get recent chat interactions
    const recentChats = await InteractionLog.find({ userId }).sort({ timestamp: -1 }).limit(3)

    recentChats.forEach((chat) => {
      recentActivities.push({
        type: "chat",
        description: `Had a conversation about ${chat.message.substring(0, 30)}...`,
        timestamp: chat.timestamp,
      })
    })

    // Sort all activities by timestamp
    recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json({
      meditationMinutes,
      journalEntries,
      breathingExercises,
      chatInteractions,
      recentActivities: recentActivities.slice(0, 5), // Return only the 5 most recent
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    res.status(500).json({ message: "Failed to fetch user stats" })
  }
})

// Get chart history from interaction logs
app.get("/api/interaction-logs/charts", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Find interaction logs with chart data
    const chartLogs = await InteractionLog.find({
      userId,
      chart: { $exists: true, $ne: null },
    })
      .sort({ timestamp: -1 })
      .limit(10)

    // Format chart data for frontend
    const charts = chartLogs.map((log) => ({
      id: log._id,
      title: log.chart.title || "Health Analysis",
      data: log.chart.data || {},
      message: log.message,
      timestamp: log.timestamp,
    }))

    res.json({ charts })
  } catch (error) {
    console.error("Error fetching chart history:", error)
    res.status(500).json({ message: "Failed to fetch chart history" })
  }
})

// Chat message endpoint - with optional authentication
app.post("/api/chat/message", optionalAuth, async (req, res) => {
  try {
    const { message } = req.body

    // Get userId from token or create a guest user if not authenticated
    let userId

    if (req.user && req.user.id) {
      // User is authenticated
      userId = req.user.id
    } else {
      // Check if a guest user exists, if not create one
      let guestUser = await User.findOne({ email: "guest@example.com" })
      if (!guestUser) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash("guestpassword", salt)

        guestUser = new User({
          name: "Guest User",
          email: "guest@example.com",
          password: hashedPassword,
        })
        await guestUser.save()
      }
      userId = guestUser._id
    }

    // Create a new session ID for this interaction
    const sessionId = uuidv4()

    // Process message with AI service
    let aiResponse
    let chartData = null
    try {
      // Try to call the Python AI service
      const response = await axios.post("http://localhost:5000/api/process", {
        message,
        userId: userId.toString(),
      })

      aiResponse = {
        message: response.data.response,
        sentiment: response.data.sentiment,
        isCrisis: response.data.is_crisis,
        resources: response.data.resources,
        keywords: response.data.keywords,
        emotions: response.data.emotions,
      }

      // Check if this is a health-related message that should generate a chart
      if (
        message.toLowerCase().includes("pain") ||
        message.toLowerCase().includes("hurt") ||
        message.toLowerCase().includes("ache") ||
        message.toLowerCase().includes("symptom") ||
        message.toLowerCase().includes("feel") ||
        message.toLowerCase().includes("health") ||
        message.toLowerCase().includes("sick") ||
        message.toLowerCase().includes("body")
      ) {
        // Generate chart data
        chartData = {
          title: "Health Analysis",
          data: {
            painLevel: response.data.emotions?.pain ? response.data.emotions.pain * 2 : Math.random() * 5 + 2,
            stressLevel: response.data.emotions?.stress ? response.data.emotions.stress * 2 : Math.random() * 5 + 1,
            anxietyLevel: response.data.emotions?.anxiety ? response.data.emotions.anxiety * 2 : Math.random() * 4 + 1,
            sleepQuality: Math.random() * 3 + 4,
            overallHealth: Math.random() * 3 + 5,
          },
        }
      }
    } catch (error) {
      console.error("Error calling AI service:", error)
      // Use fallback response if AI service is unavailable
      aiResponse = getFallbackResponse(message)

      // Generate basic chart data for health-related messages
      if (
        message.toLowerCase().includes("pain") ||
        message.toLowerCase().includes("hurt") ||
        message.toLowerCase().includes("ache") ||
        message.toLowerCase().includes("symptom") ||
        message.toLowerCase().includes("body")
      ) {
        chartData = {
          title: "Basic Health Analysis",
          data: {
            painLevel: Math.random() * 5 + 3,
            stressLevel: Math.random() * 5 + 2,
            anxietyLevel: Math.random() * 4 + 2,
            sleepQuality: Math.random() * 3 + 4,
            overallHealth: Math.random() * 3 + 4,
          },
        }
      }
    }

    // Log interaction with chart data if available
    const interaction = new InteractionLog({
      sessionId,
      userId,
      message,
      response: aiResponse.message,
      sentiment: aiResponse.sentiment,
      isCrisis: aiResponse.isCrisis,
      emotions: aiResponse.emotions || {},
      keywords: aiResponse.keywords || [],
      chart: chartData, // Save chart data in the interaction log
      timestamp: new Date(),
    })
    await interaction.save()

    // Get relevant resources
    let resources = []
    if (aiResponse.resources && aiResponse.resources.length > 0) {
      resources = aiResponse.resources
    } else {
      // Fetch resources based on sentiment or keywords
      resources = await Resource.find({
        $or: [{ tags: { $in: aiResponse.keywords || [] } }, { category: aiResponse.sentiment }],
      }).limit(3)
    }

    // Send response
    res.json({
      message: aiResponse.message,
      sessionId,
      resources,
      sentiment: aiResponse.sentiment,
      isCrisis: aiResponse.isCrisis,
      chart: chartData, // Include chart data in the response
    })
  } catch (error) {
    console.error("Error processing message:", error)
    res.status(500).json({
      error: "Failed to process message",
      message: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
    })
  }
})

// Get recent chat messages from interaction logs
app.get("/api/chat/message/recent", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find most recent interactions
    const recentInteractions = await InteractionLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20) // Limit to the most recent 20 messages
      .lean(); // Use lean() for better performance

    if (recentInteractions.length === 0) {
      return res.json({ messages: [] });
    }

    // Format messages for frontend
    const messages = recentInteractions.map((interaction) => ({
      id: interaction._id,
      sender: "user",
      text: interaction.message,
      timestamp: interaction.timestamp,
      chart: interaction.chart || null, // Include chart data if available
    }));

    // Send the formatted messages as a response
    res.json({ messages });
  } catch (error) {
    console.error("Error fetching recent chat:", error);
    res.status(500).json({ message: "Failed to fetch recent chat" });
  }
});

// Get recent chat messages from interaction logs
app.get("/api/chat/recent", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Find most recent interactions
    const recentInteractions = await InteractionLog.find({ userId }).sort({ timestamp: -1 }).limit(20).lean()

    if (recentInteractions.length === 0) {
      return res.json({ messages: [] })
    }

    // Format messages for frontend
    const messages = []

    // Add user messages
    recentInteractions.forEach((interaction) => {
      messages.push({
        id: interaction._id + "_user",
        sender: "user",
        text: interaction.message,
        timestamp: interaction.timestamp,
      })

      messages.push({
        id: interaction._id + "_bot",
        sender: "bot",
        text: interaction.response,
        timestamp: new Date(new Date(interaction.timestamp).getTime() + 1000), // Add 1 second
        chart: interaction.chart,
      })
    })

    // Sort by timestamp
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    res.json({
      messages: messages.slice(-20), // Return only the 20 most recent messages
    })
  } catch (error) {
    console.error("Error fetching recent chat:", error)
    res.status(500).json({ message: "Failed to fetch recent chat" })
  }
})

// Journal Entries API
// Create journal entry
app.post("/api/journal", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body
    const userId = req.user.id

    const journalEntry = new JournalEntry({
      userId,
      title: title || "Untitled Entry",
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await journalEntry.save()

    res.status(201).json(journalEntry)
  } catch (error) {
    console.error("Error creating journal entry:", error)
    res.status(500).json({ message: "Failed to create journal entry" })
  }
})

// Get all journal entries for a user
app.get("/api/journal", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const entries = await JournalEntry.find({ userId }).sort({ updatedAt: -1 })

    res.json(entries)
  } catch (error) {
    console.error("Error fetching journal entries:", error)
    res.status(500).json({ message: "Failed to fetch journal entries" })
  }
})

// Get a specific journal entry
app.get("/api/journal/:entryId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const entryId = req.params.entryId

    const entry = await JournalEntry.findOne({ _id: entryId, userId })

    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" })
    }

    res.json(entry)
  } catch (error) {
    console.error("Error fetching journal entry:", error)
    res.status(500).json({ message: "Failed to fetch journal entry" })
  }
})

// Update a journal entry
app.put("/api/journal/:entryId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const entryId = req.params.entryId
    const { title, content } = req.body

    const entry = await JournalEntry.findOne({ _id: entryId, userId })

    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" })
    }

    if (title !== undefined) entry.title = title
    if (content !== undefined) entry.content = content
    entry.updatedAt = new Date()

    await entry.save()

    res.json(entry)
  } catch (error) {
    console.error("Error updating journal entry:", error)
    res.status(500).json({ message: "Failed to update journal entry" })
  }
})

// Delete a journal entry
app.delete("/api/journal/:entryId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const entryId = req.params.entryId

    const result = await JournalEntry.deleteOne({ _id: entryId, userId })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Journal entry not found" })
    }

    res.json({ message: "Journal entry deleted successfully" })
  } catch (error) {
    console.error("Error deleting journal entry:", error)
    res.status(500).json({ message: "Failed to delete journal entry" })
  }
})

// Meditation Sessions API
// Save meditation session
app.post("/api/meditation", authenticateToken, async (req, res) => {
  try {
    const { duration, sound } = req.body
    const userId = req.user.id

    const meditationSession = new MeditationSession({
      userId,
      duration,
      sound,
      createdAt: new Date(),
    })

    await meditationSession.save()

    res.status(201).json(meditationSession)
  } catch (error) {
    console.error("Error saving meditation session:", error)
    res.status(500).json({ message: "Failed to save meditation session" })
  }
})

// Get meditation sessions for a user
app.get("/api/meditation", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const sessions = await MeditationSession.find({ userId }).sort({ createdAt: -1 })

    res.json(sessions)
  } catch (error) {
    console.error("Error fetching meditation sessions:", error)
    res.status(500).json({ message: "Failed to fetch meditation sessions" })
  }
})

// Breathing Sessions API
// Save breathing session
app.post("/api/breathing", authenticateToken, async (req, res) => {
  try {
    const { pattern, cycles } = req.body
    const userId = req.user.id

    const breathingSession = new BreathingSession({
      userId,
      pattern,
      cycles,
      createdAt: new Date(),
    })

    await breathingSession.save()

    res.status(201).json(breathingSession)
  } catch (error) {
    console.error("Error saving breathing session:", error)
    res.status(500).json({ message: "Failed to save breathing session" })
  }
})

// Get breathing sessions for a user
app.get("/api/breathing", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const sessions = await BreathingSession.find({ userId }).sort({ createdAt: -1 })

    res.json(sessions)
  } catch (error) {
    console.error("Error fetching breathing sessions:", error)
    res.status(500).json({ message: "Failed to fetch breathing sessions" })
  }
})

// Mood Entries API
// Save mood entry
app.post("/api/mood", authenticateToken, async (req, res) => {
  try {
    const { emotion, note } = req.body
    const userId = req.user.id

    const moodEntry = new MoodEntry({
      userId,
      emotion,
      note,
      date: new Date(),
    })

    await moodEntry.save()

    res.status(201).json({ message: "Mood entry saved successfully" })
  } catch (error) {
    console.error("Error saving mood entry:", error)
    res.status(500).json({ message: "Failed to save mood entry" })
  }
})

// Get mood entries for a user
app.get("/api/mood", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const entries = await MoodEntry.find({ userId }).sort({ date: -1 })

    res.json(entries)
  } catch (error) {
    console.error("Error fetching mood entries:", error)
    res.status(500).json({ message: "Failed to fetch mood entries" })
  }
})

// Get resources endpoint
app.get("/api/resources", async (req, res) => {
  try {
    const { category, type, query } = req.query

    const filter = {}

    if (category && category !== "All") {
      filter.category = category
    }

    if (type && type !== "All") {
      filter.type = type
    }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ]
    }

    const resources = await Resource.find(filter).sort({ createdAt: -1 })
    res.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)
    res.status(500).json({ message: "Failed to fetch resources" })
  }
})

// Fallback response generator
function getFallbackResponse(message) {
  const lowercaseMessage = message.toLowerCase()
  let responseMessage = "I'm here to listen and support you. Could you tell me more about how you're feeling?"

  if (lowercaseMessage.includes("anxious") || lowercaseMessage.includes("anxiety")) {
    responseMessage =
      "I understand feeling anxious can be challenging. Deep breathing can help - try breathing in for 4 counts, holding for 2, and exhaling for 6. Would you like to try our guided breathing exercise?"
  } else if (lowercaseMessage.includes("sad") || lowercaseMessage.includes("depressed")) {
    responseMessage =
      "I'm sorry to hear you're feeling down. Remember that it's okay to feel this way sometimes. Would it help to talk about what's contributing to these feelings?"
  } else if (lowercaseMessage.includes("stress") || lowercaseMessage.includes("stressed")) {
    responseMessage =
      "Stress can be overwhelming. Consider taking a short break to reset - even 5 minutes of mindfulness can help. Our meditation timer might be useful for this."
  } else if (lowercaseMessage.includes("sleep") || lowercaseMessage.includes("tired")) {
    responseMessage =
      "Sleep difficulties can significantly impact mental health. Establishing a consistent bedtime routine and limiting screen time before bed may help. Would you like some more sleep hygiene tips?"
  } else if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
    responseMessage = "Hello! I'm here to support you. How are you feeling today?"
  } else if (
    lowercaseMessage.includes("pain") ||
    lowercaseMessage.includes("hurt") ||
    lowercaseMessage.includes("ache")
  ) {
    responseMessage =
      "I'm sorry to hear you're experiencing pain. Physical discomfort can be challenging to deal with. Have you spoken with a healthcare provider about this? In the meantime, gentle relaxation techniques might provide some relief."
  }

  // Extract keywords
  const keywords = extractKeywordsSimple(message)

  return {
    message: responseMessage,
    sentiment:
      lowercaseMessage.includes("anxious") ||
      lowercaseMessage.includes("sad") ||
      lowercaseMessage.includes("stress") ||
      lowercaseMessage.includes("pain")
        ? "negative"
        : "neutral",
    isCrisis: false,
    resources: [],
    keywords: keywords,
    emotions: {},
  }
}

// Simple keyword extraction function for fallback
function extractKeywordsSimple(text) {
  const stopWords = [
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "you",
    "your",
    "yours",
    "he",
    "him",
    "his",
    "she",
    "her",
    "hers",
    "it",
    "its",
    "they",
    "them",
    "their",
    "theirs",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "can",
    "will",
    "just",
    "should",
    "now",
    "a",
    "an",
    "the",
    "and",
  ]

  // Convert to lowercase and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)

  // Filter out stop words
  const filteredWords = words.filter((word) => !stopWords.includes(word) && word.length > 2)

  // Count word frequency
  const wordCounts = {}
  filteredWords.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  })

  // Sort by frequency
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .map((item) => item[0])

  // Return top 5 keywords
  return sortedWords.slice(0, 5)
}

// Catch-all route to serve React app in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
  })
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
