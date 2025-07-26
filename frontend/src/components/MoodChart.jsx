"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BarChart3, LineChart, Calendar, Info } from "lucide-react"
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const emotions = [
  { name: "Very Happy", value: 5, color: "#ec4899" }, // pink-500
  { name: "Happy", value: 4, color: "#22c55e" }, // green-500
  { name: "Neutral", value: 3, color: "#eab308" }, // yellow-500
  { name: "Sad", value: 2, color: "#f97316" }, // orange-500
  { name: "Very Sad", value: 1, color: "#ef4444" }, // red-500
]

const MoodChart = () => {
  const [entries, setEntries] = useState([])
  const [chartData, setChartData] = useState({ daily: [], distribution: [] })
  const [user, setUser] = useState(null)
  const [view, setView] = useState("daily") // "daily" or "distribution"
  const [period, setPeriod] = useState("week") // "week" or "month"

  // Load entries from localStorage
  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }

    const savedEntries = localStorage.getItem("emotionEntries")
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries)
        // Filter entries by user if logged in
        const userEntries = user ? parsedEntries.filter((entry) => entry.userId === user.id) : parsedEntries

        // Convert string dates back to Date objects
        const formattedEntries = userEntries.map((entry) => ({
          ...entry,
          date: new Date(entry.date),
          value: emotions.find((e) => e.name === entry.emotion)?.value || 3, // Default to neutral
        }))
        setEntries(formattedEntries)
      } catch (error) {
        console.error("Error parsing saved emotion entries:", error)
      }
    }
  }, [user])

  // Process data for charts
  useEffect(() => {
    if (entries.length > 0) {
      // Process data for daily chart
      const daysToShow = period === "week" ? 7 : 30
      const lastDays = [...Array(daysToShow)]
        .map((_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - i)
          return date.toLocaleDateString()
        })
        .reverse()

      const dailyData = lastDays.map((day) => {
        const dayEntries = entries.filter((entry) => new Date(entry.date).toLocaleDateString() === day)
        const avgValue = dayEntries.length
          ? dayEntries.reduce((sum, entry) => sum + entry.value, 0) / dayEntries.length
          : null
        return {
          name: day,
          value: avgValue,
        }
      })

      // Process data for distribution chart
      const distributionData = emotions.map((emotion) => {
        const count = entries.filter((entry) => entry.emotion === emotion.name).length
        return {
          name: emotion.name,
          value: count,
          color: emotion.color,
        }
      })

      setChartData({
        daily: dailyData,
        distribution: distributionData,
      })
    }
  }, [entries, period])

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-teal-700 text-white p-4">
          <h2 className="text-xl font-semibold flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Mood Trends
          </h2>
          <p className="text-sm text-teal-100">Visualize your emotional patterns over time</p>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center p-4">
          <Calendar className="h-16 w-16 text-teal-300 mb-4" />
          <h3 className="text-lg font-medium text-teal-800 mb-2">No mood data yet</h3>
          <p className="text-gray-600 max-w-md mb-6">
            Track your mood regularly to see patterns and trends in your emotional wellbeing.
          </p>
          {!user && (
            <p className="text-sm text-gray-500 mb-4">
              <Link to="/login" className="text-teal-600 hover:underline">
                Log in
              </Link>{" "}
              to save your mood history
            </p>
          )}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Track Your Mood Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-teal-700 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Mood Trends
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setView("daily")}
              className={`p-1 rounded-md ${
                view === "daily" ? "bg-teal-800 text-white" : "text-teal-200 hover:bg-teal-800/50"
              }`}
              title="Daily View"
            >
              <LineChart className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView("distribution")}
              className={`p-1 rounded-md ${
                view === "distribution" ? "bg-teal-800 text-white" : "text-teal-200 hover:bg-teal-800/50"
              }`}
              title="Distribution View"
            >
              <BarChart3 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="text-sm text-teal-100">Visualize your emotional patterns over time</p>
      </div>

      <div className="p-4">
        {view === "daily" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-teal-800 flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-teal-600" />
                Daily Mood
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPeriod("week")}
                  className={`px-3 py-1 text-sm rounded-full ${
                    period === "week" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setPeriod("month")}
                  className={`px-3 py-1 text-sm rounded-full ${
                    period === "month" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={chartData.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    }}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => {
                      const emotion = emotions.find((e) => e.value === value)
                      return emotion ? emotion.name.split(" ")[0] : value
                    }}
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.375rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    formatter={(value) => {
                      if (value === null) return ["No data", "Mood"]
                      const emotion = emotions.find((e) => e.value === Math.round(value))
                      return [emotion ? emotion.name : value.toFixed(1), "Mood"]
                    }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={{ fill: "#0d9488", r: 4 }}
                    activeDot={{ r: 6, fill: "#0d9488" }}
                    connectNulls={true}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Info className="h-4 w-4 mr-1" />
              <span>Gaps indicate days with no mood entries</span>
            </div>
          </div>
        )}

        {view === "distribution" && (
          <div>
            <h3 className="text-lg font-medium text-teal-800 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-teal-600" />
              Emotion Distribution
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData.distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.375rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                  <Bar dataKey="value" name="Count">
                    {chartData.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            You've tracked your mood {entries.length} time{entries.length !== 1 ? "s" : ""}
          </p>
          <Link
            to="/mood-history"
            className="inline-block mt-2 text-sm text-teal-600 hover:text-teal-800 hover:underline"
          >
            View detailed mood history
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MoodChart
