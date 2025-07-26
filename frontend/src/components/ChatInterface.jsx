"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Smile, PaperclipIcon, Mic, BarChart2 } from "lucide-react"
import axios from "axios"
import { formatTime } from "../lib/utils"
import MindfulChatLogo from "./MindfulChatLogo"

const ChatInterface = ({ chatHistory, onSendMessage, isLoading, user }) => {
  const [message, setMessage] = useState("")
  const [showEmojis, setShowEmojis] = useState(false)
  const [showChartHistory, setShowChartHistory] = useState(false)
  const [chartHistory, setChartHistory] = useState([])
  const [isLoadingCharts, setIsLoadingCharts] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Fetch chart history when component mounts
  useEffect(() => {
    if (user?.id && showChartHistory) {
      fetchChartHistory()
    }
  }, [user?.id, showChartHistory])

  // Fetch chart history from interaction logs
  const fetchChartHistory = async () => {
    try {
      setIsLoadingCharts(true)
      const response = await axios.get("/api/chat/charts")
      if (response.data && response.data.charts) {
        setChartHistory(response.data.charts)
      }
    } catch (error) {
      console.error("Error fetching chart history:", error)
    } finally {
      setIsLoadingCharts(false)
    }
  }

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory, isLoading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      try {
        const response = await axios.post("/api/chat/message", {
          message: message.trim(),
          sessionId
        })

        // Update session ID if this is a new chat
        if (response.data.sessionId && !sessionId) {
          setSessionId(response.data.sessionId)
        }

        // Call the parent's onSendMessage with the response data
        onSendMessage(message.trim(), response.data)
        setMessage("")
      } catch (error) {
        console.error("Error sending message:", error)
        // Show error message in chat
        onSendMessage(message.trim(), {
          error: "Failed to send message. Please try again."
        })
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Sample emojis for the emoji picker
  const emojis = ["😊", "😢", "😡", "😔", "😴", "🙂", "❤️", "👍", "🤔", "😂"]

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji)
    setShowEmojis(false)
  }

  // Render chart component
  const renderChart = (chart) => {
    if (!chart || !chart.data) return null

    return (
      <div className="mt-2 p-3 bg-teal-50 rounded-lg border border-teal-200">
        <h4 className="text-sm font-medium text-teal-800 mb-1">{chart.title || "Health Analysis"}</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(chart.data).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-teal-600 mr-1"></div>
              <span className="text-xs text-gray-700">
                {key}: {typeof value === "number" ? value.toFixed(2) : value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <MindfulChatLogo className="w-8 h-8" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mindful Chat
          </h2>
        </div>
        <button
          onClick={() => setShowChartHistory(!showChartHistory)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <BarChart2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {chatHistory.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.timestamp && (
                <span className="text-xs opacity-70 mt-1 block">
                  {formatTime(new Date(msg.timestamp))}
                </span>
              )}
              {msg.error && (
                <span className="text-xs text-red-500 mt-1 block">
                  {msg.error}
                </span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Smile className="w-5 h-5" />
          </button>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            rows={1}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
