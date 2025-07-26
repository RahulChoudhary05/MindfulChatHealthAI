"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  MessageSquare,
  Search,
  Calendar,
  Trash2,
  Download,
  Filter,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  X,
} from "lucide-react"
import axios from "axios"
import { format } from "date-fns"

const ChatHistoryPage = ({ user }) => {
  const navigate = useNavigate()
  const [chatHistory, setChatHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [chatToDelete, setChatToDelete] = useState(null)
  const [actionMenuVisible, setActionMenuVisible] = useState(false)
  const [selectedChatForActions, setSelectedChatForActions] = useState(null)

  // Fetch chat history from the server
  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          navigate("/login")
          return
        }

        // Build query parameters
        let queryParams = `?page=${page}&limit=${limit}`
        if (searchTerm) queryParams += `&search=${encodeURIComponent(searchTerm)}`
        if (selectedDate) queryParams += `&date=${selectedDate}`

        const response = await axios.get(`/api/chat/chats${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setChatHistory(response.data.chats)
        setTotalPages(response.data.totalPages || 1)
      } catch (err) {
        console.error("Error fetching chat history:", err)
        setError(err.response?.data?.message || "Failed to load chat history")

        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatHistory()
  }, [navigate, page, limit, searchTerm, selectedDate])

  // Fetch chat details when a chat is selected
  useEffect(() => {
    const fetchChatDetails = async (chatId) => {
      try {
        const token = localStorage.getItem("token")

        const response = await axios.get(`/api/chat/session/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setSelectedChat(response.data)
      } catch (err) {
        console.error("Error fetching chat details:", err)
        setError(err.response?.data?.message || "Failed to load chat details")
      }
    }

    if (selectedChat?._id) {
      fetchChatDetails(selectedChat._id)
    }
  }, [selectedChat?._id])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value || null)
    setPage(1) // Reset to first page on date filter change
  }

  const handleDeleteChat = async () => {
    if (!chatToDelete) return

    try {
      const token = localStorage.getItem("token")

      await axios.delete(`/api/chat/session/${chatToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Remove from state
      setChatHistory(chatHistory.filter((chat) => chat._id !== chatToDelete))

      if (selectedChat && selectedChat._id === chatToDelete) {
        setSelectedChat(null)
      }

      setShowDeleteConfirm(false)
      setChatToDelete(null)
    } catch (err) {
      console.error("Error deleting chat:", err)
      setError(err.response?.data?.message || "Failed to delete chat")
    }
  }

  const confirmDelete = (chatId) => {
    setChatToDelete(chatId)
    setShowDeleteConfirm(true)
    setActionMenuVisible(false)
  }

  const downloadChat = (chat) => {
    if (!chat || !chat.messages) return

    const chatContent = chat.messages
      .map((msg) => `${msg.role === "user" ? "You" : "MindfulChat "}: ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([`Chat: ${chat.title}\nDate: ${format(new Date(chat.createdAt), "PPP")}\n\n${chatContent}`], {
      type: "text/plain",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MindfulChat -${format(new Date(chat.createdAt), "yyyy-MM-dd")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setActionMenuVisible(false)
  }

  const toggleActionMenu = (chat) => {
    setSelectedChatForActions(chat)
    setActionMenuVisible(!actionMenuVisible)
  }

  const closeActionMenu = () => {
    setActionMenuVisible(false)
  }

  // Handle pagination
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-teal-800 mb-2">Chat History</h1>
            <p className="text-teal-600">Review and manage your previous conversations with MindfulChat .</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <div className="flex items-center">
              <X className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="mt-2 text-sm text-red-700 hover:text-red-900 underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-teal-100 overflow-hidden card-3d">
              <div className="p-4 border-b border-teal-100">
                <form onSubmit={handleSearch} className="mb-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-teal-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full p-2 bg-white border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                    <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-500">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-teal-500 mr-2" />
                  <span className="text-sm text-gray-700 mr-2">Filter by date:</span>
                  <input
                    type="date"
                    value={selectedDate || ""}
                    onChange={handleDateChange}
                    className="p-1 text-sm bg-white border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  />
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="ml-2 text-xs text-teal-600 hover:text-teal-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-teal-600">Loading your chat history...</p>
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <MessageSquare className="h-12 w-12 text-teal-300 mb-3" />
                    <p className="text-teal-600">
                      {searchTerm || selectedDate
                        ? "No chats match your search criteria."
                        : "No chat history found. Start a conversation!"}
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-teal-100">
                    {chatHistory.map((chat) => (
                      <li
                        key={chat._id}
                        className={`p-4 cursor-pointer hover:bg-teal-50 transition-colors relative ${
                          selectedChat?._id === chat._id ? "bg-teal-100" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start" onClick={() => setSelectedChat(chat)}>
                          <div className="flex-1 pr-8">
                            <div className="font-medium text-gray-900 truncate">{chat.title}</div>
                            <div className="text-xs text-teal-600 mt-1 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(chat.createdAt), "PPP")}
                            </div>
                            {chat.summary && (
                              <div className="text-sm text-gray-700 mt-1 line-clamp-2">{chat.summary}</div>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleActionMenu(chat)
                            }}
                            className="text-gray-500 hover:text-teal-700"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Action Menu */}
                        {actionMenuVisible && selectedChatForActions?._id === chat._id && (
                          <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-teal-100">
                            <div className="py-1">
                              <button
                                onClick={() => downloadChat(chat)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 w-full text-left"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Chat
                              </button>
                              <button
                                onClick={() => confirmDelete(chat._id)}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Chat
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-3 border-t border-teal-100 flex justify-between items-center">
                  <button
                    onClick={goToPrevPage}
                    disabled={page === 1}
                    className={`p-1 rounded-md ${
                      page === 1 ? "text-gray-400 cursor-not-allowed" : "text-teal-600 hover:bg-teal-50"
                    }`}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                    className={`p-1 rounded-md ${
                      page === totalPages ? "text-gray-400 cursor-not-allowed" : "text-teal-600 hover:bg-teal-50"
                    }`}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Viewer */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-teal-100 h-[500px] flex flex-col card-3d">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b border-teal-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{selectedChat.title}</h2>
                      <div className="text-xs text-teal-600 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {selectedChat.createdAt && format(new Date(selectedChat.createdAt), "PPP p")}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadChat(selectedChat)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-full"
                        title="Download Chat"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(selectedChat._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete Chat"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChat.messages?.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-teal-600 to-teal-500 text-white rounded-tr-none"
                              : "bg-gray-100 border border-gray-200 rounded-tl-none text-gray-800"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs mt-1 opacity-70 text-right">
                            {message.timestamp && format(new Date(message.timestamp), "p")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <MessageSquare className="h-16 w-16 text-teal-200 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Conversation</h3>
                  <p className="text-gray-600 max-w-md">
                    Choose a chat from the list to view your conversation history with MindfulChat .
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Chat</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setChatToDelete(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChat}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close action menu */}
      {actionMenuVisible && <div className="fixed inset-0 z-0" onClick={closeActionMenu}></div>}
    </div>
  )
}

export default ChatHistoryPage
