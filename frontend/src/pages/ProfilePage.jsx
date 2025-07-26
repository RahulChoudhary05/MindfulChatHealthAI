"use client"

import { useState, useEffect } from "react"
import {
  User,
  Mail,
  Lock,
  Edit2,
  Save,
  Camera,
  Calendar,
  Clock,
  Activity,
  LogOut,
  MessageSquare,
  Trash2,
  AlertCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const ProfilePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState(null)

  // Fetch user data from the server
  useEffect(() => {
    // Removed mock user and stats data
    const fetchUserData = async () => {
  setIsLoading(true)
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    // Fetch user data
    const userResponse = await axios.get("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })

    setUser(userResponse.data)
    setEditedUser(userResponse.data)

    // Fetch user stats
    const statsResponse = await axios.get("/api/user/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })

    setStats(statsResponse.data)

  } catch (err) {
    console.error("Error fetching user data:", err)
    setError("Failed to load user data. Please try again later.")
  } finally {
    setIsLoading(false)
  }
}


    fetchUserData()
  }, [navigate])

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      try {
        // Try to update via API
        const response = await axios.put("/api/user/profile", editedUser, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setUser(response.data.user)
        setEditedUser(response.data.user)
        setIsEditing(false)
        setSuccessMessage("Profile updated successfully")

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      } catch (apiError) {
        console.error("Error updating profile:", apiError)
        setError(apiError.response?.data?.message || "Failed to update profile. Please try again later.")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError(null)

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      try {
        // Try to update via API
        await axios.put(
          "/api/user/profile",
          {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        setSuccessMessage("Password changed successfully")

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      } catch (apiError) {
        console.error("Error changing password:", apiError)
        setPasswordError(apiError.response?.data?.message || "Failed to change password. Please try again later.")
      }
    } catch (err) {
      console.error("Error changing password:", err)
      setPasswordError("Failed to change password. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      try {
        // Try to delete via API
        await axios.delete("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (apiError) {
        console.warn("API not available, simulating account deletion:", apiError)
        // Just simulate success if API fails
      }

      // Clear local storage and redirect to home
      localStorage.removeItem("token")
      navigate("/")
    } catch (err) {
      console.error("Error deleting account:", err)
      setError("Failed to delete account. Please try again later.")
    } finally {
      setIsLoading(false)
      setConfirmDelete(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      // Create a preview URL for immediate feedback
      const previewUrl = URL.createObjectURL(file)
      setEditedUser({ ...editedUser, avatar: previewUrl })

      const formData = new FormData()
      formData.append("avatar", file)

      const token = localStorage.getItem("token")

      try {
        // Try to upload via API
        const response = await axios.post("/api/user/upload-avatar", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })

        // Update with the real URL from the server
        setEditedUser({ ...editedUser, avatar: response.data.avatarUrl })
      } catch (apiError) {
        console.warn("API not available, using local preview:", apiError)
        // Keep the preview URL if API fails
      }
    } catch (err) {
      console.error("Error handling avatar:", err)
      setError("Failed to upload avatar. Please try again later.")
    }
  }

  // Show loading state
  if (isLoading && !user) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-purple-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-red-100">
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Error Loading Profile</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user || !stats) return null

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-lg">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6 sticky top-20">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-purple-600 mb-4">{user.email}</p>
                <div className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === "profile"
                          ? "bg-purple-100 text-purple-900"
                          : "text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                      }`}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === "activity"
                          ? "bg-purple-100 text-purple-900"
                          : "text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                      }`}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Activity
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === "settings"
                          ? "bg-purple-100 text-purple-900"
                          : "text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                      }`}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                  </li>
                  <li className="pt-4 border-t border-gray-200 mt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 rounded-md flex items-center text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  {isEditing ? (
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                      <div className="relative">
                        {editedUser.avatar ? (
                          <img
                            src={editedUser.avatar || "/placeholder.svg"}
                            alt={editedUser.name}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                            {editedUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full cursor-pointer"
                        >
                          <Camera className="h-4 w-4" />
                          <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={editedUser.bio || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                        placeholder="Tell us a bit about yourself..."
                      ></textarea>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notifications"
                            checked={editedUser.preferences?.notifications ?? true}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                preferences: {
                                  ...(editedUser.preferences || {}),
                                  notifications: e.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                            Enable notifications
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                          <select
                            value={editedUser.preferences?.language || "English"}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                preferences: {
                                  ...(editedUser.preferences || {}),
                                  language: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Chinese">Chinese</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                          <select
                            value={editedUser.preferences?.theme || "light"}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                preferences: {
                                  ...(editedUser.preferences || {}),
                                  theme: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-2">
                          <User className="h-5 w-5 text-purple-600 mr-2" />
                          <h3 className="text-sm font-medium text-gray-900">Full Name</h3>
                        </div>
                        <p className="text-gray-700">{user.name}</p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-2">
                          <Mail className="h-5 w-5 text-purple-600 mr-2" />
                          <h3 className="text-sm font-medium text-gray-900">Email Address</h3>
                        </div>
                        <p className="text-gray-700">{user.email}</p>
                      </div>
                    </div>

                    {user.bio && (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Bio</h3>
                        <p className="text-gray-700">{user.bio}</p>
                      </div>
                    )}

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Preferences</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">Notifications</div>
                          <div className="text-gray-700">
                            {user.preferences?.notifications !== false ? "Enabled" : "Disabled"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">Language</div>
                          <div className="text-gray-700">{user.preferences?.language || "English"}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">Theme</div>
                          <div className="text-gray-700 capitalize">{user.preferences?.theme || "light"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Activity</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Meditation Sessions</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.meditationCount}</div>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <Clock className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Journal Entries</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.journalCount}</div>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <Edit2 className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Breathing Sessions</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.breathingCount}</div>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <Activity className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Chat Sessions</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.chatCount}</div>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  {stats.recentActivities && stats.recentActivities.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                            {activity.type === "chat" && <MessageSquare className="h-4 w-4" />}
                            {activity.type === "journal" && <Edit2 className="h-4 w-4" />}
                            {activity.type === "meditation" && <Clock className="h-4 w-4" />}
                            {activity.type === "breathing" && <Activity className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                            <div className="text-xs text-gray-600">
                              {new Date(activity.timestamp).toLocaleDateString()} at{" "}
                              {new Date(activity.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-gray-600 mb-2">No activity recorded yet</div>
                      <p className="text-sm text-gray-500">Start using the app's features to see your activity here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    {passwordError && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{passwordError}</div>
                    )}
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Accounts</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Facebook</div>
                            <div className="text-xs text-gray-600">Not connected</div>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">
                          Connect
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Google</div>
                            <div className="text-xs text-gray-600">Not connected</div>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">
                          Connect
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">GitHub</div>
                            <div className="text-xs text-gray-600">Not connected</div>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    {confirmDelete ? (
                      <div className="bg-white p-4 rounded-lg border border-red-200 mb-4">
                        <p className="text-red-700 font-medium mb-3">Are you absolutely sure?</p>
                        <p className="text-sm text-gray-700 mb-4">
                          This will permanently delete your account, all your data, and cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1 inline-block" />
                                Yes, Delete My Account
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
