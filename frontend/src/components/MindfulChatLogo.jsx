"use client"
import { motion } from "framer-motion"

const MindfulChatLogo = ({ size = "md", animated = true, className = "" }) => {
  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    "2xl": "w-32 h-32",
  }

  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  }

  const circleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  const MotionComponent = animated ? motion.svg : "svg"
  const initialProps = animated ? { initial: "hidden", animate: "visible", variants: logoVariants } : {}

  return (
    <MotionComponent
      viewBox="0 0 100 100"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...initialProps}
    >
      {/* Background Circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#gradient)"
        variants={animated ? circleVariants : undefined}
        whileHover={animated ? { scale: 1.05 } : undefined}
      />

      {/* Brain Icon */}
      <motion.path
        d="M65,40 C68,35 68,30 65,25 C62,20 55,18 50,20 C45,18 38,20 35,25 C32,30 32,35 35,40 C32,45 32,50 35,55 C38,60 45,62 50,60 C55,62 62,60 65,55 C68,50 68,45 65,40 Z"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        variants={animated ? pathVariants : undefined}
      />

      {/* Brain Details */}
      <motion.path
        d="M50,20 C50,30 50,40 50,60 M40,30 C45,35 55,35 60,30 M40,50 C45,45 55,45 60,50"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        variants={animated ? pathVariants : undefined}
      />

      {/* AI Circuit Pattern */}
      <motion.path
        d="M25,50 C30,45 35,50 40,50 C45,50 50,40 55,40 C60,40 65,50 70,50 C75,50 80,45 85,50"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={animated ? { ...pathVariants, ...pulseVariants } : undefined}
        animate={animated ? "pulse" : undefined}
      />

      {/* Medical Cross */}
      <motion.path
        d="M50,70 L50,85 M42.5,77.5 L57.5,77.5"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        variants={animated ? pathVariants : undefined}
      />

      {/* Stethoscope */}
      <motion.path
        d="M30,65 C25,65 25,75 30,75 C35,75 35,65 30,65 M30,75 C30,80 35,85 40,85"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={animated ? pathVariants : undefined}
      />

      {/* Digital Health Dots */}
      <motion.circle cx="70" cy="65" r="2" fill="#FFFFFF" variants={animated ? circleVariants : undefined} />
      <motion.circle cx="75" cy="70" r="2" fill="#FFFFFF" variants={animated ? circleVariants : undefined} />
      <motion.circle cx="70" cy="75" r="2" fill="#FFFFFF" variants={animated ? circleVariants : undefined} />
      <motion.circle cx="65" cy="70" r="2" fill="#FFFFFF" variants={animated ? circleVariants : undefined} />

      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
    </MotionComponent>
  )
}

export default MindfulChatLogo
