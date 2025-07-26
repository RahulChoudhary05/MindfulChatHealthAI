"use client"

import { useState, useEffect } from "react"
import MindfulChatLogo from "./MindfulChatLogo"
import LoaderText from "./LoaderText"

const Loader = ({ fullScreen = false, message = "Loading...", showMatrix = false }) => {
  const [showMatrixText, setShowMatrixText] = useState(true)

  useEffect(() => {
    if (showMatrix) {
      const timer = setTimeout(() => {
        setShowMatrixText(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showMatrix])

  const loaderContent = (
    <div className="relative">
      <MindfulChatLogo size={fullScreen ? "2xl" : "xl"} />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50">
        {loaderContent}
        {showMatrixText ? (
          <div className="mt-8">
            <LoaderText text="MindfulChat  AI" className="text-teal-600" />
          </div>
        ) : (
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{message}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {loaderContent}
      <p className="mt-3 text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  )
}

export default Loader
