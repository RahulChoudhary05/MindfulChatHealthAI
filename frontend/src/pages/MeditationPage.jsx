"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RefreshCw, Volume2, VolumeX, Moon, Clock, Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"

const MeditationPage = ({ user }) => {
  const [duration, setDuration] = useState(5) // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60) // seconds
  const [isActive, setIsActive] = useState(false)
  const [selectedSound, setSelectedSound] = useState(null)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [completedSessions, setCompletedSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)
  const audioRef = useRef(null)

  const ambientSounds = [
    { name: "Rain", url: "/audio/rain.mp3" },
    { name: "Ocean", url: "/audio/ocean.mp3" },
    { name: "Forest", url: "/audio/forest.mp3" },
    { name: "White Noise", url: "/audio/white-noise.mp3" },
  ]

  // Fetch meditation sessions from API
  useEffect(() => {
    const fetchMeditationSessions = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await axios.get("/api/meditation", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setCompletedSessions(response.data)
      } catch (error) {
        console.error("Error fetching meditation sessions:", error)
        setError("Failed to load meditation sessions. Please try again later.")

        // Fallback to localStorage if API fails
        const savedSessions = localStorage.getItem("meditationSessions")
        if (savedSessions) {
          try {
            setCompletedSessions(JSON.parse(savedSessions))
          } catch (error) {
            console.error("Error parsing saved meditation sessions:", error)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeditationSessions()
  }, [user?.id])

  // Initialize audio
  useEffect(() => {
    if (selectedSound) {
      const sound = ambientSounds.find((s) => s.name === selectedSound)
      if (sound) {
        if (!audioRef.current) {
          audioRef.current = new Audio(sound.url)
          audioRef.current.loop = true
        } else {
          audioRef.current.src = sound.url
        }
        audioRef.current.volume = volume / 100
        if (isActive && !isMuted) {
          audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
        }
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [selectedSound, isActive])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  const startTimer = () => {
    setIsActive(true)
    if (timeLeft === 0) {
      setTimeLeft(duration * 60)
    }

    // Start playing sound if selected
    if (selectedSound && audioRef.current && !isMuted) {
      audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
    }
  }

  const pauseTimer = () => {
    setIsActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Pause sound
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(duration * 60)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Pause sound
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.pause()
      } else if (isActive) {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
      }
    }
  }

  const incrementDuration = () => {
    setDuration((prev) => {
      const newDuration = prev + 1
      if (!isActive) {
        setTimeLeft(newDuration * 60)
      }
      return newDuration
    })
  }

  const decrementDuration = () => {
    setDuration((prev) => {
      const newDuration = Math.max(1, prev - 1)
      if (!isActive) {
        setTimeLeft(newDuration * 60)
      }
      return newDuration
    })
  }

  // Save completed session to API
  const saveCompletedSession = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const sessionData = {
        type: selectedSound ? "nature" : "unguided",
        duration: duration,
        title: `${duration} Minute Meditation${selectedSound ? ` with ${selectedSound}` : ""}`,
        description: "A peaceful meditation session",
        audioUrl: selectedSound ? ambientSounds.find(s => s.name === selectedSound)?.url : null,
        moodBefore: "calm"
      }

      const response = await axios.post("/api/meditation", sessionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Add to completed sessions
      setCompletedSessions((prev) => [response.data, ...prev])
    } catch (error) {
      console.error("Error saving meditation session:", error)
      setError("Failed to save meditation session. Please try again later.")

      // Fallback to localStorage if API fails
      const newSession = {
        _id: Date.now().toString(),
        type: selectedSound ? "nature" : "unguided",
        duration,
        title: `${duration} Minute Meditation${selectedSound ? ` with ${selectedSound}` : ""}`,
        description: "A peaceful meditation session",
        audioUrl: selectedSound ? ambientSounds.find(s => s.name === selectedSound)?.url : null,
        moodBefore: "calm",
        createdAt: new Date().toISOString(),
      }

      const updatedSessions = [newSession, ...completedSessions]
      setCompletedSessions(updatedSessions)
      localStorage.setItem("meditationSessions", JSON.stringify(updatedSessions))
    }
  }

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer complete
            clearInterval(timerRef.current)
            setIsActive(false)

            // Save completed session
            saveCompletedSession()

            // Pause sound
            if (audioRef.current) {
              audioRef.current.pause()
            }

            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isActive, timeLeft])

  // Update timeLeft when duration changes
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60)
    }
  }, [duration, isActive])

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-900 mb-2">Meditation Timer</h1>
          <p className="text-teal-700">Take a moment to breathe, relax, and center yourself.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="mt-2 text-sm text-red-700 hover:text-red-900 underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg border border-teal-100 p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 mb-8">
                {/* Progress circle */}
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-teal-100 stroke-current"
                    strokeWidth="4"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-teal-500 stroke-current transition-all duration-500"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * progressPercentage) / 100}
                    transform="rotate(-90 50 50)"
                  />
                </svg>

                {/* Timer display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-teal-900 mb-2">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-teal-600">
                    {isActive ? "Meditating..." : timeLeft === 0 ? "Complete" : "Ready"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={decrementDuration}
                  disabled={isActive || duration <= 1}
                  className="p-2 rounded-full bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 transition-colors disabled:opacity-50"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="text-lg font-medium text-teal-900 w-24 text-center">{duration} minutes</div>
                <button
                  onClick={incrementDuration}
                  disabled={isActive}
                  className="p-2 rounded-full bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="flex space-x-4 mb-8">
                {!isActive ? (
                  <button
                    onClick={startTimer}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {timeLeft === 0 ? "Restart" : "Start"}
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="px-6 py-2 bg-white border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors flex items-center"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  disabled={!isActive && timeLeft === duration * 60}
                  className="px-6 py-2 bg-white border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors flex items-center disabled:opacity-50"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </button>
              </div>

              <div className="w-full">
                <h3 className="text-lg font-medium text-teal-900 mb-3">Ambient Sound</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {ambientSounds.map((sound) => (
                    <button
                      key={sound.name}
                      onClick={() => setSelectedSound(sound.name === selectedSound ? null : sound.name)}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedSound === sound.name
                          ? "bg-teal-100 border-teal-500 text-teal-900"
                          : "border-teal-200 bg-white text-teal-700 hover:text-teal-900 hover:bg-teal-50"
                      }`}
                    >
                      {sound.name}
                    </button>
                  ))}
                </div>

                {selectedSound && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-teal-900">Volume</span>
                      <button
                        onClick={toggleMute}
                        className="p-1 rounded-md hover:bg-teal-100 text-teal-600 hover:text-teal-900 transition-colors"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number.parseInt(e.target.value))}
                      disabled={isMuted}
                      className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-teal-100 p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-teal-600 mr-2" />
                <h2 className="text-xl font-semibold text-teal-900">Meditation History</h2>
              </div>

              <div className="h-[300px] overflow-y-auto pr-2">
                {completedSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Moon className="h-12 w-12 text-teal-300 mb-3" />
                    <p className="text-teal-600">
                      Complete your first meditation session to start tracking your progress.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedSessions
                      .slice()
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((session, index) => (
                        <motion.div
                          key={session._id || index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="p-3 rounded-lg border border-teal-100 bg-teal-50"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-teal-900">{session.duration} minute session</div>
                              <div className="text-xs text-teal-600">
                                {new Date(session.createdAt).toLocaleDateString()} at{" "}
                                {new Date(session.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                            {session.sound && (
                              <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
                                {session.sound}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg border border-teal-100 p-6">
              <h2 className="text-xl font-semibold text-teal-900 mb-4">Meditation Benefits</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3 text-teal-600">
                    1
                  </div>
                  <div>
                    <span className="font-medium text-teal-900">Reduces Stress and Anxiety</span>
                    <p className="text-sm text-teal-700">
                      Regular meditation can lower cortisol levels and help manage stress responses.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3 text-teal-600">
                    2
                  </div>
                  <div>
                    <span className="font-medium text-teal-900">Improves Focus and Concentration</span>
                    <p className="text-sm text-teal-700">
                      Meditation trains your mind to stay present and enhances attention span.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-3 text-teal-600">
                    3
                  </div>
                  <div>
                    <span className="font-medium text-teal-900">Promotes Emotional Well-being</span>
                    <p className="text-sm text-teal-700">
                      Regular practice can increase positive emotions and decrease negative ones.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MeditationPage
