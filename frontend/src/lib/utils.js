// Utility function to conditionally join class names
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

// Function to format a timestamp into readable date (e.g., Jan 1, 2025)
export const formatDate = (timestamp) => {
  if (!timestamp) return ""
  const date = new Date(timestamp)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Function to format a timestamp into readable time (e.g., 03:45 PM)
export const formatTime = (timestamp) => {
  if (!timestamp) return ""
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Function to generate a unique ID
export const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

// Function to truncate text to a maximum length
export const truncateText = (text, maxLength) => {
  if (!text || typeof text !== "string") return ""
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "..."
}

// Function to get initials from a name
export const getInitials = (name) => {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
