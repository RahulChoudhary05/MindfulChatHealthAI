"use client"

import { useState, useEffect } from "react"
import { PenLine, Save, Trash2, Calendar, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import axios from "axios"

const JournalPage = ({ user }) => {
  const [entries, setEntries] = useState([])
  const [currentEntry, setCurrentEntry] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load entries from API on component mount
  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await axios.get("/api/journal", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Convert string dates back to Date objects
        const formattedEntries = response.data.map((entry) => ({
          ...entry,
          date: new Date(entry.createdAt),
        }))

        setEntries(formattedEntries)
        if (formattedEntries.length > 0) {
          setCurrentEntry(formattedEntries[0])
        }
      } catch (error) {
        console.error("Error fetching journal entries:", error)
        setError("Failed to load journal entries. Please try again later.")

        // Fallback to localStorage if API fails
        const savedEntries = localStorage.getItem("journalEntries")
        if (savedEntries) {
          try {
            const parsedEntries = JSON.parse(savedEntries)
            const formattedEntries = parsedEntries.map((entry) => ({
              ...entry,
              date: new Date(entry.date),
            }))
            setEntries(formattedEntries)
            if (formattedEntries.length > 0) {
              setCurrentEntry(formattedEntries[0])
            }
          } catch (error) {
            console.error("Error parsing saved journal entries:", error)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [user?.id])

  const createNewEntry = () => {
    const newEntry = {
      title: "",
      content: "",
      date: new Date(),
    }
    setCurrentEntry(newEntry)
    setIsEditing(true)
  }

  const saveEntry = async () => {
    if (currentEntry) {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        // Ensure all required fields are present and valid
        const entryData = {
          title: currentEntry.title?.trim() || "Untitled Entry",
          content: currentEntry.content?.trim() || "",
          mood: (currentEntry.mood || "neutral").toLowerCase(),
          tags: currentEntry.tags || []
        }

        // Validate required fields
        if (!entryData.title || !entryData.content) {
          setError("Title and content are required")
          return
        }

        // Validate mood
        const validMoods = ['happy', 'sad', 'angry', 'anxious', 'calm', 'neutral']
        if (!validMoods.includes(entryData.mood)) {
          entryData.mood = 'neutral'
        }

        let response
        if (currentEntry._id) {
          // Update existing entry
          response = await axios.put(`/api/journal/${currentEntry._id}`, entryData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          // Update entries array
          setEntries((prevEntries) =>
            prevEntries.map((entry) =>
              entry._id === currentEntry._id ? { ...response.data, date: new Date(response.data.createdAt) } : entry,
            ),
          )
        } else {
          // Create new entry
          response = await axios.post("/api/journal", entryData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          // Add new entry to entries array
          setEntries((prevEntries) => [{ ...response.data, date: new Date(response.data.createdAt) }, ...prevEntries])
        }

        // Update current entry with response data
        setCurrentEntry({ ...response.data, date: new Date(response.data.createdAt) })
        setIsEditing(false)
      } catch (error) {
        console.error("Error saving journal entry:", error)
        setError("Failed to save journal entry. Please try again later.")

        // Fallback to localStorage if API fails
        if (currentEntry._id) {
          // Update existing entry
          const entryIndex = entries.findIndex((e) => e._id === currentEntry._id)
          if (entryIndex >= 0) {
            const updatedEntries = [...entries]
            updatedEntries[entryIndex] = currentEntry
            setEntries(updatedEntries)
            localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
          }
        } else {
          // Add new entry with generated ID
          const newEntryWithId = {
            ...currentEntry,
            _id: Date.now().toString(),
          }
          const updatedEntries = [newEntryWithId, ...entries]
          setEntries(updatedEntries)
          setCurrentEntry(newEntryWithId)
          localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
        }
        setIsEditing(false)
      }
    }
  }

  const deleteEntry = async () => {
    if (currentEntry && currentEntry._id) {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        await axios.delete(`/api/journal/${currentEntry._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Remove entry from entries array
        const updatedEntries = entries.filter((e) => e._id !== currentEntry._id)
        setEntries(updatedEntries)
        setCurrentEntry(updatedEntries.length > 0 ? updatedEntries[0] : null)
        setIsEditing(false)
      } catch (error) {
        console.error("Error deleting journal entry:", error)
        setError("Failed to delete journal entry. Please try again later.")

        // Fallback to localStorage if API fails
        const updatedEntries = entries.filter((e) => e._id !== currentEntry._id)
        setEntries(updatedEntries)
        localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))
        setCurrentEntry(updatedEntries.length > 0 ? updatedEntries[0] : null)
        setIsEditing(false)
      }
    }
  }

  const selectEntry = (entry) => {
    setCurrentEntry(entry)
    setIsEditing(false)
  }

  const navigateEntries = (direction) => {
    if (!currentEntry || entries.length <= 1) return

    const currentIndex = entries.findIndex((e) => e._id === currentEntry._id)
    if (currentIndex === -1) return

    let newIndex
    if (direction === "prev") {
      newIndex = currentIndex === 0 ? entries.length - 1 : currentIndex - 1
    } else {
      newIndex = currentIndex === entries.length - 1 ? 0 : currentIndex + 1
    }

    setCurrentEntry(entries[newIndex])
    setIsEditing(false)
  }

  // Filter entries based on search term
  const filteredEntries = entries.filter(
    (entry) =>
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-teal-900 mb-2">Journal</h1>
            <p className="text-teal-700">
              Record your thoughts, feelings, and experiences to track your mental health journey.
            </p>
          </div>
          <button
            onClick={createNewEntry}
            className="mt-4 md:mt-0 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="mt-2 text-sm text-red-700 hover:text-red-900 underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Entry List */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-teal-100 overflow-hidden">
              <div className="p-4 border-b border-teal-100">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-teal-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full p-2 bg-white border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-teal-900"
                  />
                </div>
              </div>
              <div className="h-[500px] overflow-y-auto">
                {filteredEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Calendar className="h-12 w-12 text-teal-300 mb-3" />
                    <p className="text-teal-600">
                      {entries.length === 0
                        ? "No journal entries yet. Create your first entry!"
                        : "No entries match your search."}
                    </p>
                    {entries.length === 0 && (
                      <button
                        onClick={createNewEntry}
                        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Create First Entry
                      </button>
                    )}
                  </div>
                ) : (
                  <ul className="divide-y divide-teal-100">
                    {filteredEntries
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((entry) => (
                        <motion.li
                          key={entry._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 cursor-pointer hover:bg-teal-50 transition-colors ${
                            currentEntry?._id === entry._id ? "bg-teal-100" : ""
                          }`}
                          onClick={() => selectEntry(entry)}
                        >
                          <div className="font-medium text-teal-900 truncate">{entry.title || "Untitled Entry"}</div>
                          <div className="text-xs text-teal-600 mt-1">
                            {format(new Date(entry.date), "MMMM d, yyyy")}
                          </div>
                          {entry.content && (
                            <div className="text-sm text-teal-700 mt-1 line-clamp-2">{entry.content}</div>
                          )}
                        </motion.li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Entry Editor/Viewer */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-teal-100 h-[500px] flex flex-col">
              {currentEntry ? (
                <>
                  <div className="p-4 border-b border-teal-100 flex-shrink-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentEntry.title || ""}
                        onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                        placeholder="Entry Title"
                        className="w-full p-2 bg-white border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-teal-900 font-medium"
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-teal-900">
                          {currentEntry.title || "Untitled Entry"}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigateEntries("prev")}
                            disabled={entries.length <= 1}
                            className="p-1 rounded-md hover:bg-teal-100 text-teal-600 hover:text-teal-900 transition-colors disabled:opacity-50"
                            aria-label="Previous entry"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <span className="text-sm text-teal-600">
                            {format(new Date(currentEntry.date), "MMMM d, yyyy")}
                          </span>
                          <button
                            onClick={() => navigateEntries("next")}
                            disabled={entries.length <= 1}
                            className="p-1 rounded-md hover:bg-teal-100 text-teal-600 hover:text-teal-900 transition-colors disabled:opacity-50"
                            aria-label="Next entry"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow overflow-y-auto p-4">
                    {isEditing ? (
                      <textarea
                        value={currentEntry.content || ""}
                        onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                        placeholder="Write your thoughts here..."
                        className="w-full h-full p-2 bg-white border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-teal-900 resize-none"
                      />
                    ) : (
                      <div className="whitespace-pre-wrap text-teal-900">
                        {currentEntry.content || (
                          <span className="text-teal-500 italic">No content in this entry.</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-teal-100 flex-shrink-0">
                    {isEditing ? (
                      <div className="flex justify-between">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-white text-teal-700 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEntry}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <button
                          onClick={deleteEntry}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                        >
                          <PenLine className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <PenLine className="h-16 w-16 text-teal-300 mb-4" />
                  <h2 className="text-xl font-semibold text-teal-900 mb-2">Your Journal</h2>
                  <p className="text-teal-700 mb-6">
                    Start journaling to track your thoughts, feelings, and experiences.
                  </p>
                  <button
                    onClick={createNewEntry}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Entry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg border border-teal-100 p-6">
          <h2 className="text-xl font-semibold text-teal-900 mb-4">Journaling Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
              <h3 className="font-medium text-teal-900 mb-2">Be Consistent</h3>
              <p className="text-sm text-teal-700">
                Try to write regularly, even if it's just a few sentences. Consistency helps build the habit.
              </p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
              <h3 className="font-medium text-teal-900 mb-2">Be Honest</h3>
              <p className="text-sm text-teal-700">
                Your journal is private. Write honestly about your thoughts and feelings without judgment.
              </p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
              <h3 className="font-medium text-teal-900 mb-2">Reflect on Patterns</h3>
              <p className="text-sm text-teal-700">
                Periodically review your entries to identify patterns in your thoughts, feelings, and behaviors.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default JournalPage
