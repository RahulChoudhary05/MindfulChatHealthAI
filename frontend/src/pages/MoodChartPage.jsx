"use client"

import { useState, useEffect } from "react"
import { Calendar, BarChart2, LineChart, PieChart, Filter } from "lucide-react"
import { motion } from "framer-motion"
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import axios from "axios"

const emotions = [
  { name: "Very Happy", value: 5, color: "#22c55e" }, // green-500
  { name: "Happy", value: 4, color: "#3b82f6" }, // blue-500
  { name: "Neutral", value: 3, color: "#f59e0b" }, // amber-500
  { name: "Sad", value: 2, color: "#f97316" }, // orange-500
  { name: "Very Sad", value: 1, color: "#ef4444" }, // red-500
]

const MoodChartPage = ({ user }) => {
  const [entries, setEntries] = useState([])
  const [timeRange, setTimeRange] = useState("week") // week, month, year
  const [chartData, setChartData] = useState({ daily: [], distribution: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch mood entries from API
  useEffect(() => {
    const fetchMoodEntries = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await axios.get("/api/journal", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Format entries with emotion value
        const formattedEntries = response.data.map((entry) => ({
          ...entry,
          date: new Date(entry.createdAt),
          emotion: entry.mood,
          value: emotions.find((e) => e.name.toLowerCase() === entry.mood)?.value || 3, // Default to neutral
        }))

        setEntries(formattedEntries)
      } catch (error) {
        console.error("Error fetching mood entries:", error)
        setError("Failed to load mood entries. Please try again later.")

        // Fallback to localStorage if API fails
        const savedEntries = localStorage.getItem("emotionEntries")
        if (savedEntries) {
          try {
            const parsedEntries = JSON.parse(savedEntries)
            const formattedEntries = parsedEntries.map((entry) => ({
              ...entry,
              date: new Date(entry.date),
              value: emotions.find((e) => e.name === entry.emotion)?.value || 3,
            }))
            setEntries(formattedEntries)
          } catch (error) {
            console.error("Error parsing saved emotion entries:", error)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoodEntries()
  }, [user?.id])

  // Process data for charts when entries or time range changes
  useEffect(() => {
    if (entries.length > 0) {
      // Determine date range based on selected time range
      const now = new Date()
      let startDate
      let dateFormat
      let groupBy

      switch (timeRange) {
        case "week":
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 7)
          dateFormat = (date) => date.toLocaleDateString(undefined, { weekday: "short" })
          groupBy = (date) => date.toLocaleDateString()
          break
        case "month":
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 30)
          dateFormat = (date) => `${date.getMonth() + 1}/${date.getDate()}`
          groupBy = (date) => date.toLocaleDateString()
          break
        case "year":
          startDate = new Date(now)
          startDate.setFullYear(now.getFullYear() - 1)
          dateFormat = (date) => date.toLocaleDateString(undefined, { month: "short" })
          groupBy = (date) => `${date.getFullYear()}-${date.getMonth()}`
          break
        default:
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 7)
          dateFormat = (date) => date.toLocaleDateString(undefined, { weekday: "short" })
          groupBy = (date) => date.toLocaleDateString()
      }

      // Filter entries within the selected time range
      const filteredEntries = entries.filter((entry) => entry.date >= startDate)

      // Group entries by date and calculate average mood value
      const groupedEntries = {}
      filteredEntries.forEach((entry) => {
        const key = groupBy(entry.date)
        if (!groupedEntries[key]) {
          groupedEntries[key] = {
            values: [],
            date: entry.date,
          }
        }
        groupedEntries[key].values.push(entry.value)
      })

      // Convert grouped entries to chart data format
      const dailyData = Object.entries(groupedEntries).map(([key, data]) => {
        const avgValue = data.values.reduce((sum, val) => sum + val, 0) / data.values.length
        return {
          name: dateFormat(data.date),
          value: avgValue,
          fullDate: data.date,
        }
      })

      // Sort by date
      dailyData.sort((a, b) => a.fullDate - b.fullDate)

      // Calculate emotion distribution
      const distributionData = emotions.map((emotion) => {
        const count = filteredEntries.filter((entry) => entry.emotion === emotion.name).length
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
  }, [entries, timeRange])

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Mood Tracking</h1>
            <p className="text-muted-foreground">
              Visualize your emotional patterns and gain insights into your mental wellbeing.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="mt-2 text-sm text-red-700 hover:text-red-900 underline">
              Dismiss
            </button>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="bg-card rounded-lg shadow-lg border border-border p-12 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Mood Data Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start tracking your mood to see patterns and insights over time.
            </p>
            <a
              href="/chat"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Track Your Mood
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow-lg border border-border p-6">
              <div className="flex items-center mb-4">
                <LineChart className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold text-foreground">Mood Over Time</h2>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData.daily} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(value) => {
                        const emotion = emotions.find((e) => e.value === value)
                        return emotion ? emotion.name : value
                      }}
                      stroke="var(--muted-foreground)"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                      formatter={(value) => {
                        const emotion = emotions.find((e) => e.value === Math.round(value))
                        return [emotion ? emotion.name : value.toFixed(1), "Mood"]
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--primary)" }}
                      activeDot={{ r: 8 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg shadow-lg border border-border p-6">
                <div className="flex items-center mb-4">
                  <PieChart className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-xl font-semibold text-foreground">Mood Distribution</h2>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={chartData.distribution.filter((item) => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-lg border border-border p-6">
                <div className="flex items-center mb-4">
                  <BarChart2 className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-xl font-semibold text-foreground">Mood Frequency</h2>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData.distribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      />
                      <Bar dataKey="value" name="Frequency">
                        {chartData.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MoodChartPage