"use client"

import { useState, useEffect, useRef } from "react"
import { Clock, Play, Pause, RefreshCw, Info } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import { format } from "date-fns"

const breathingPatterns = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    inhale: 4,
    hold: 7,
    exhale: 8,
  },
  {
    name: "Box Breathing",
    description: "Inhale for 4, hold for 4, exhale for 4, hold for 4",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
  },
  {
    name: "Deep Calm",
    description: "Inhale for 5, hold for 2, exhale for 6",
    inhale: 5,
    hold: 2,
    exhale: 6,
  },
  {
    name: "Relaxing Breath",
    description: "Inhale for 3, hold for 2, exhale for 6",
    inhale: 3,
    hold: 2,
    exhale: 6,
  },
]

const BreathingPage = ({ user }) => {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState("inhale")
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0])
  const [cycles, setCycles] = useState(0)
  const [totalCycles, setTotalCycles] = useState(3)
  const [progress, setProgress] = useState(0)
  const [completedSessions, setCompletedSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [isSessionLocked, setIsSessionLocked] = useState(false)
  const circleRef = useRef(null)
  const timerRef = useRef(null)
  const saveTimeoutRef = useRef(null)

  // Fetch breathing sessions from API
  useEffect(() => {
    const fetchBreathingSessions = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await axios.get("/api/breathing", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setCompletedSessions(response.data)
      } catch (error) {
        console.error("Error fetching breathing sessions:", error)
        setError("Failed to load breathing sessions. Please try again later.")

        // Fallback to localStorage if API fails
        const savedSessions = localStorage.getItem("breathingSessions")
        if (savedSessions) {
          try {
            setCompletedSessions(JSON.parse(savedSessions))
          } catch (error) {
            console.error("Error parsing saved breathing sessions:", error)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchBreathingSessions()
  }, [user?.id])

  const startExercise = () => {
    setIsActive(true)
    setCycles(0)
    setCurrentPhase("inhale")
    setTimeLeft(selectedPattern.inhale)
    setIsSessionComplete(false)
    setIsSessionLocked(false)
  }

  const pauseExercise = () => {
    setIsActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const resetExercise = () => {
    setIsActive(false)
    setCycles(0)
    setCurrentPhase("inhale")
    setTimeLeft(selectedPattern.inhale)
    setProgress(0)
    setIsSessionComplete(false)
    setIsSessionLocked(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
  }

  // Save completed session to API
  const saveCompletedSession = async () => {
    if (isSaving || isSessionComplete || isSessionLocked) return

    try {
      setIsSaving(true)
      setIsSessionLocked(true)
      const token = localStorage.getItem("token")
      if (!token) return

      // Calculate total duration in minutes
      const totalSeconds = totalCycles * (
        selectedPattern.inhale + 
        (selectedPattern.hold || 0) + 
        selectedPattern.exhale + 
        (selectedPattern.holdAfterExhale || 0)
      )
      const durationInMinutes = Math.max(1, Math.min(30, Math.round(totalSeconds / 60)))

      // Map pattern name to valid type
      const getBreathingType = (patternName) => {
        switch (patternName) {
          case "4-7-8 Breathing": return "4-7-8"
          case "Box Breathing": return "box"
          case "Deep Calm": return "deep"
          default: return "custom"
        }
      }

      const sessionData = {
        type: getBreathingType(selectedPattern.name),
        duration: durationInMinutes,
        inhaleTime: Math.max(1, Math.min(20, selectedPattern.inhale)),
        holdTime: selectedPattern.hold ? Math.max(0, Math.min(20, selectedPattern.hold)) : undefined,
        exhaleTime: Math.max(1, Math.min(20, selectedPattern.exhale)),
        cycles: Math.max(1, Math.min(100, totalCycles)),
        title: `${selectedPattern.name} Breathing Exercise`,
        description: selectedPattern.description,
        moodBefore: "calm",
        completed: true,
        completedAt: new Date()
      }

      // Validate required fields
      if (!sessionData.type || !sessionData.duration || !sessionData.inhaleTime || !sessionData.exhaleTime || !sessionData.cycles) {
        setError("Missing required fields for breathing session")
        return
      }

      const response = await axios.post("/api/breathing", sessionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Add to completed sessions
      setCompletedSessions((prev) => [response.data, ...prev])
      setIsSessionComplete(true)

      // Show success animation
      const circle = circleRef.current
      if (circle) {
        circle.classList.add('session-complete')
        setTimeout(() => {
          circle.classList.remove('session-complete')
        }, 2000)
      }
    } catch (error) {
      console.error("Error saving breathing session:", error)
      setError("Failed to save breathing session. Please try again later.")
    } finally {
      setIsSaving(false)
    }
  }

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer complete for current phase
            clearInterval(timerRef.current)
            
            if (currentPhase === "inhale") {
              if (selectedPattern.hold > 0) {
              setCurrentPhase("hold")
                setTimeLeft(selectedPattern.hold)
              } else {
                setCurrentPhase("exhale")
                setTimeLeft(selectedPattern.exhale)
              }
            } else if (currentPhase === "hold") {
              setCurrentPhase("exhale")
              setTimeLeft(selectedPattern.exhale)
            } else if (currentPhase === "exhale") {
              if (selectedPattern.holdAfterExhale > 0) {
                setCurrentPhase("holdAfterExhale")
                setTimeLeft(selectedPattern.holdAfterExhale)
              } else {
                // Cycle complete
                const newCycles = cycles + 1
                setCycles(newCycles)
                setProgress((newCycles / totalCycles) * 100)
                
                if (newCycles >= totalCycles) {
                  // Session complete
                  setIsActive(false)
                  if (!isSessionComplete) {
                    saveTimeoutRef.current = setTimeout(() => {
                  saveCompletedSession()
                    }, 500)
                  }
                } else {
                  // Start next cycle
                  setCurrentPhase("inhale")
                  setTimeLeft(selectedPattern.inhale)
                }
              }
            } else if (currentPhase === "holdAfterExhale") {
              // Cycle complete
              const newCycles = cycles + 1
              setCycles(newCycles)
              setProgress((newCycles / totalCycles) * 100)
              
              if (newCycles >= totalCycles) {
                // Session complete
                setIsActive(false)
                if (!isSessionComplete) {
                  saveTimeoutRef.current = setTimeout(() => {
                saveCompletedSession()
                  }, 500)
                }
              } else {
                // Start next cycle
                setCurrentPhase("inhale")
                setTimeLeft(selectedPattern.inhale)
              }
            }
            return prev
          }
          return prev - 1
        })
      }, 1000)
    }

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [isActive, timeLeft, currentPhase, cycles, totalCycles, selectedPattern, isSessionComplete])

  // Add enhanced CSS for animations and theme
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .breathing-circle {
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      }
      .breathing-circle.inhale {
        transform: scale(1.2);
        background-color: #34d399;
        box-shadow: 0 20px 25px -5px rgba(52, 211, 153, 0.3);
      }
      .breathing-circle.hold {
        background-color: #60a5fa;
        box-shadow: 0 20px 25px -5px rgba(96, 165, 250, 0.3);
      }
      .breathing-circle.exhale {
        transform: scale(1);
        background-color: #f87171;
        box-shadow: 0 20px 25px -5px rgba(248, 113, 113, 0.3);
      }
      .breathing-circle.holdAfterExhale {
        background-color: #a78bfa;
        box-shadow: 0 20px 25px -5px rgba(167, 139, 250, 0.3);
      }
      .breathing-circle.session-complete {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1);
      }
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
        50% { transform: scale(1.2); box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.4); }
        100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
      }
      .pattern-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
      }
      .pattern-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
      }
      .pattern-card.selected {
        border-color: #10b981;
        background-color: #f0fdf4;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
      }
      .phase-indicator {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background-color: rgba(16, 185, 129, 0.1);
      }
      .phase-indicator.active {
        transform: scale(1.1);
        color: #10b981;
        background-color: rgba(16, 185, 129, 0.2);
      }
      .control-button {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      }
      .control-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
      }
      .control-button:active:not(:disabled) {
        transform: translateY(0);
      }
      .progress-bar {
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
      }
      .session-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(16, 185, 129, 0.2);
      }
      .session-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

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
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-teal-900 mb-4"
          >
            Breathing Exercises
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-teal-700 text-lg max-w-2xl mx-auto"
          >
            Take a moment to breathe and find your center. Choose a pattern, set your pace, and begin your journey to mindfulness.
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            <p>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Breathing Exercise */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-teal-100 p-8"
          >
            <div className="flex flex-col items-center">
              <div
                ref={circleRef}
                className={`breathing-circle w-72 h-72 rounded-full flex items-center justify-center mb-8 ${
                  isActive ? currentPhase : ''
                }`}
                style={{
                  backgroundColor: isActive
                    ? currentPhase === 'inhale'
                      ? '#34d399'
                      : currentPhase === 'hold'
                      ? '#60a5fa'
                      : currentPhase === 'exhale'
                      ? '#f87171'
                      : '#a78bfa'
                    : '#e2e8f0',
                }}
              >
                <div className="text-center">
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-bold text-white mb-3"
                  >
                    {isActive ? timeLeft : 'Ready'}
                  </motion.div>
                  <motion.div
                    key={currentPhase}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xl text-white capitalize"
                  >
                    {isActive ? currentPhase : 'Start'}
                  </motion.div>
                </div>
              </div>

              <div className="flex space-x-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                      onClick={startExercise}
                  disabled={isActive || isSaving}
                  className={`control-button px-8 py-4 rounded-xl font-medium text-lg ${
                    isActive || isSaving
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {isActive ? 'Pause' : 'Start'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                    onClick={resetExercise}
                    disabled={!isActive && cycles === 0}
                  className={`control-button px-8 py-4 rounded-xl font-medium text-lg ${
                    !isActive && cycles === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                    Reset
                </motion.button>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                <motion.div
                  className="progress-bar h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
                </div>
              <div className="text-teal-700 text-lg font-medium">
                Cycle {cycles} of {totalCycles}
              </div>
            </div>
          </motion.div>

          {/* Pattern Selection */}
          <div className="space-y-6">
                        <motion.div
              initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl border border-teal-100 p-8"
            >
              <h2 className="text-2xl font-semibold text-teal-900 mb-6">Breathing Patterns</h2>
              <div className="grid gap-4">
                {breathingPatterns.map((pattern, index) => (
                  <motion.div
                    key={pattern.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`pattern-card p-6 rounded-xl ${
                      selectedPattern.name === pattern.name
                        ? 'selected'
                        : 'hover:border-teal-300'
                    }`}
                    onClick={() => setSelectedPattern(pattern)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                        <h3 className="text-lg font-medium text-teal-900 mb-1">{pattern.name}</h3>
                        <p className="text-sm text-teal-600">{pattern.description}</p>
                              </div>
                      <div className="flex items-center space-x-3">
                        <span className="phase-indicator active">In: {pattern.inhale}s</span>
                        {pattern.hold > 0 && (
                          <span className="phase-indicator">Hold: {pattern.hold}s</span>
                        )}
                        <span className="phase-indicator">Ex: {pattern.exhale}s</span>
                        {pattern.holdAfterExhale > 0 && (
                          <span className="phase-indicator">Hold: {pattern.holdAfterExhale}s</span>
                )}
              </div>
            </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-xl border border-teal-100 p-8"
            >
              <h2 className="text-2xl font-semibold text-teal-900 mb-6">Session Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-teal-700 mb-3">
                    Number of Cycles
                  </label>
                  <div className="flex items-center space-x-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setTotalCycles(Math.max(1, totalCycles - 1))}
                      disabled={isActive}
                      className="p-3 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 disabled:opacity-50 shadow-sm"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </motion.button>
                    <span className="text-2xl font-medium text-teal-900">{totalCycles}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setTotalCycles(Math.min(100, totalCycles + 1))}
                      disabled={isActive}
                      className="p-3 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 disabled:opacity-50 shadow-sm"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.button>
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Completed Sessions */}
        {completedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 bg-white rounded-2xl shadow-xl border border-teal-100 p-8"
          >
            <h2 className="text-2xl font-semibold text-teal-900 mb-6">Recent Sessions</h2>
            <div className="grid gap-4">
              {completedSessions.slice(0, 5).map((session, index) => (
                <motion.div
                  key={session._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="session-card p-6 bg-teal-50 rounded-xl"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-teal-900 mb-1">{session.title}</h3>
                      <p className="text-sm text-teal-600">
                        {format(new Date(session.startedAt), 'MMMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-teal-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {session.duration} min
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {session.cycles} cycles
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default BreathingPage
