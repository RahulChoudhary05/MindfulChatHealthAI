"use client"

import { useState } from "react"
import { Smile, Frown, Meh, Heart, Send } from "lucide-react"
import axios from "axios"

const EmotionTracker = ({ userId }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null)

  const emotions = [
    { name: "Very Happy", icon: <Smile className="h-6 w-6" />, color: "bg-green-500 hover:bg-green-600" },
    { name: "Happy", icon: <Smile className="h-6 w-6" />, color: "bg-blue-500 hover:bg-blue-600" },
    { name: "Neutral", icon: <Meh className="h-6 w-6" />, color: "bg-amber-500 hover:bg-amber-600" },
    { name: "Sad", icon: <Frown className="h-6 w-6" />, color: "bg-orange-500 hover:bg-orange-600" },
    { name: "Very Sad", icon: <Frown className="h-6 w-6" />, color: "bg-red-500 hover:bg-red-600" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedEmotion) return

    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")

      // Send to API
      await axios.post(
        "/api/mood",
        {
          emotion: selectedEmotion,
          note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Reset form
      setSelectedEmotion(null)
      setNote("")

      // Fallback to localStorage if needed
      const newEntry = {
        emotion: selectedEmotion,
        note,
        date: new Date().toISOString(),
      }

      const savedEntries = localStorage.getItem("emotionEntries")
      const entries = savedEntries ? JSON.parse(savedEntries) : []
      entries.push(newEntry)
      localStorage.setItem("emotionEntries", JSON.stringify(entries))
    } catch (error) {
      console.error("Error saving mood:", error)
      setError("Failed to save your mood. Please try again.")

      // Fallback to localStorage
      const newEntry = {
        emotion: selectedEmotion,
        note,
        date: new Date().toISOString(),
      }

      const savedEntries = localStorage.getItem("emotionEntries")
      const entries = savedEntries ? JSON.parse(savedEntries) : []
      entries.push(newEntry)
      localStorage.setItem("emotionEntries", JSON.stringify(entries))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-teal-100 p-4">
      <div className="flex items-center mb-4">
        <Heart className="h-5 w-5 text-teal-600 mr-2" />
        <h3 className="text-lg font-medium text-teal-900">How are you feeling?</h3>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">Your mood has been recorded!</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-4">
          {emotions.map((emotion) => (
            <button
              key={emotion.name}
              type="button"
              onClick={() => setSelectedEmotion(emotion.name)}
              className={`p-2 rounded-full text-white transition-colors ${
                selectedEmotion === emotion.name ? `${emotion.color} ring-2 ring-offset-2 ring-teal-500` : emotion.color
              }`}
              title={emotion.name}
            >
              {emotion.icon}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="note" className="block text-sm font-medium text-teal-700 mb-1">
            Add a note (optional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's contributing to this feeling?"
            className="w-full p-2 border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700 text-sm"
            rows={2}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={!selectedEmotion || isSubmitting}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Record Mood"}
        </button>
      </form>
    </div>
  )
}

export default EmotionTracker
