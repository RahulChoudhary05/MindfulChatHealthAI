"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "../lib/utils"

const LoaderText = ({
  text = "MindfulChat ",
  className,
  initialDelay = 200,
  letterAnimationDuration = 500,
  letterInterval = 100,
}) => {
  const [letters, setLetters] = useState(() =>
    text.split("").map((char) => ({
      char,
      isMatrix: false,
      isSpace: char === " ",
    })),
  )
  const [isAnimating, setIsAnimating] = useState(false)

  const getRandomChar = useCallback(() => (Math.random() > 0.5 ? "1" : "0"), [])

  const animateLetter = useCallback(
    (index) => {
      if (index >= text.length) return

      requestAnimationFrame(() => {
        setLetters((prev) => {
          const newLetters = [...prev]
          if (!newLetters[index].isSpace) {
            newLetters[index] = {
              ...newLetters[index],
              char: getRandomChar(),
              isMatrix: true,
            }
          }
          return newLetters
        })

        setTimeout(() => {
          setLetters((prev) => {
            const newLetters = [...prev]
            newLetters[index] = {
              ...newLetters[index],
              char: text[index],
              isMatrix: false,
            }
            return newLetters
          })
        }, letterAnimationDuration)
      })
    },
    [getRandomChar, text, letterAnimationDuration],
  )

  const startAnimation = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)
    let currentIndex = 0

    const animate = () => {
      if (currentIndex >= text.length) {
        setIsAnimating(false)
        return
      }

      animateLetter(currentIndex)
      currentIndex++
      setTimeout(animate, letterInterval)
    }

    animate()
  }, [animateLetter, isAnimating, letterInterval])

  useEffect(() => {
    const timer = setTimeout(startAnimation, initialDelay)
    return () => clearTimeout(timer)
  }, [startAnimation, initialDelay])

  const motionVariants = useMemo(
    () => ({
      matrix: {
        color: "#14b8a6", // Teal color for matrix effect
        textShadow: "0 2px 4px rgba(20, 184, 166, 0.5)", // Teal shadow
      },
    }),
    [],
  )

  return (
    <div
      className={cn("flex items-center justify-center text-black dark:text-white", className)}
      aria-label="Matrix text animation"
    >
      <div className="h-24 flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center">
          {letters.map((letter, index) => (
            <motion.div
              key={`${index}-${letter.char}`}
              className="font-mono text-4xl md:text-6xl w-[1ch] text-center overflow-hidden"
              initial="initial"
              animate={letter.isMatrix ? "matrix" : "normal"}
              variants={motionVariants}
              transition={{
                duration: 0.1,
                ease: "easeInOut",
              }}
              style={{
                display: "inline-block",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {letter.isSpace ? "\u00A0" : letter.char}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoaderText
