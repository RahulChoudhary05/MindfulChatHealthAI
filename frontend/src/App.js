"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import LandingPage from "./pages/LandingPage"
import JournalPage from "./pages/JournalPage"
import MeditationPage from "./pages/MeditationPage"
import BreathingPage from "./pages/BreathingPage"
import MoodChartPage from "./pages/MoodChartPage"
import AboutPage from "./pages/AboutPage"
import ResourcesPage from "./pages/ResourcesPage"
import PrivacyPage from "./pages/PrivacyPage"
import ProfilePage from "./pages/ProfilePage"
import ChatHistoryPage from "./pages/ChatHistoryPage"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Loader from "./components/Loader"
import ResourcesPanel from "./components/ResourcesPanel"
import EmotionTracker from "./components/EmotionTracker"
// import { ThemeProvider } from "./components/ThemeProvider"
import axios from "axios"
import ChatInterface from "./components/ChatInterface" // Import ChatInterface
import "./index.css"

// Set default base URL for axios
axios.defaults.baseURL = 'http://localhost:4000' || "https://mindfulchathealthaibackend.onrender.com";
axios.defaults.withCredentials = true;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure token is properly formatted
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setIsAuthenticated(true)
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Function to handle login
  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return <Loader fullScreen={true} message="Loading your chat..." showMatrix={true} />
  }

  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} user={user} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/chat"
                element={
                  isAuthenticated ? <ChatPage user={user} /> : <Navigate to="/login" state={{ from: "/chat" }} />
                }
              />
              <Route
                path="/journal"
                element={
                  isAuthenticated ? <JournalPage user={user} /> : <Navigate to="/login" state={{ from: "/journal" }} />
                }
              />
              <Route
                path="/meditation"
                element={
                  isAuthenticated ? (
                    <MeditationPage user={user} />
                  ) : (
                    <Navigate to="/login" state={{ from: "/meditation" }} />
                  )
                }
              />
              <Route
                path="/breathing"
                element={
                  isAuthenticated ? (
                    <BreathingPage user={user} />
                  ) : (
                    <Navigate to="/login" state={{ from: "/breathing" }} />
                  )
                }
              />
              <Route
                path="/mood-chart"
                element={
                  isAuthenticated ? (
                    <MoodChartPage user={user} />
                  ) : (
                    <Navigate to="/login" state={{ from: "/mood-chart" }} />
                  )
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route
                path="/profile"
                element={
                  isAuthenticated ? (
                    <ProfilePage user={user} setUser={setUser} />
                  ) : (
                    <Navigate to="/login" state={{ from: "/profile" }} />
                  )
                }
              />
              <Route
                path="/chat-history"
                element={
                  isAuthenticated ? (
                    <ChatHistoryPage user={user} />
                  ) : (
                    <Navigate to="/login" state={{ from: "/chat-history" }} />
                  )
                }
              />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/chat" /> : <Login onLogin={handleLogin} />}
              />
              <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to="/chat" /> : <Signup onSignup={handleLogin} />}
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  )
}

function ChatPage({ user }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [resources, setResources] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from API or localStorage
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // If no token, try to load from localStorage
          const savedChatHistory = localStorage.getItem(`chatHistory_${user?.id || "guest"}`);
          if (savedChatHistory) {
            setChatHistory(JSON.parse(savedChatHistory));
          }
          return;
        }

        const response = await axios.get("/api/chat/message/recent");

        if (response.data.messages && response.data.messages.length > 0) {
          setChatHistory(response.data.messages);
          setSessionId(response.data.sessionId);
        } else {
          // If no messages from API, try localStorage
          const savedChatHistory = localStorage.getItem(`chatHistory_${user?.id || "guest"}`);
          if (savedChatHistory) {
            setChatHistory(JSON.parse(savedChatHistory));
          }
        }
      } catch (error) {
        console.error("Error fetching recent chat:", error);
        // Fallback to localStorage
        const savedChatHistory = localStorage.getItem(`chatHistory_${user?.id || "guest"}`);
        if (savedChatHistory) {
          try {
            setChatHistory(JSON.parse(savedChatHistory));
          } catch (error) {
            console.error("Error parsing chat history:", error);
          }
        }
      }
    };

    fetchChatHistory();
  }, [user?.id]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(`chatHistory_${user?.id || "guest"}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, user?.id]);

  // Function to handle sending messages to the backend
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to chat history
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await axios.post("/api/chat/message", {
        message,
        sessionId,
      });

      // Add bot response to chat history
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.data.aiResponse.response,
        timestamp: new Date().toISOString(),
        chart: response.data.aiResponse.chart ? {
          title: response.data.aiResponse.chart.title,
          data: response.data.aiResponse.chart.data
        } : null,
      };

      setChatHistory((prev) => [...prev, botMessage]);

      // Update session ID if this is a new chat
      if (response.data.sessionId && !sessionId) {
        setSessionId(response.data.sessionId);
      }

      // Update resources if provided
      if (response.data.resources && response.data.resources.length > 0) {
        setResources(response.data.resources);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message to chat history
      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow md:w-2/3">
          <ChatInterface
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            user={user}
          />
        </div>
        <div className="md:w-1/3 space-y-6">
          <ResourcesPanel resources={resources} />
          <EmotionTracker userId={user?.id} />
        </div>
      </div>
    </div>
  );
}

export default App
