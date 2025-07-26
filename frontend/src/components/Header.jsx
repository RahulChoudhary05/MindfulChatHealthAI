"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, User, MessageSquare, BookOpen, BarChart2, Wind, LogOut } from "lucide-react"
import MindfulChatLogo from "./MindfulChatLogo"

const Header = ({ isAuthenticated, onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  const handleLogout = () => {
    onLogout()
    navigate("/")
    setIsMenuOpen(false)
    setIsProfileMenuOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MindfulChatLogo className="h-8 w-8" />
            <span className="text-xl font-bold text-teal-700">MindfulChat </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-teal-600 font-medium">
              About
            </Link>
            <Link to="/resources" className="text-gray-600 hover:text-teal-600 font-medium">
              Resources
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/chat" className="text-gray-600 hover:text-teal-600 font-medium">
                  Chat
                </Link>
                <Link to="/journal" className="text-gray-600 hover:text-teal-600 font-medium">
                  Journal
                </Link>
                <Link to="/meditation" className="text-gray-600 hover:text-teal-600 font-medium">
                  Meditation
                </Link>
                <Link to="/breathing" className="text-gray-600 hover:text-teal-600 font-medium">
                  Breathing
                </Link>
              </>
            ) : null}
          </nav>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="h-5 w-5 text-teal-600" />
                    )}
                  </div>
                  <span className="font-medium">{user?.name || "User"}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </div>
                    </Link>
                    <Link
                      to="/chat-history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat History</span>
                      </div>
                    </Link>
                    <Link
                      to="/mood-chart"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <BarChart2 className="h-4 w-4" />
                        <span>Mood Chart</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-teal-600 font-medium hover:text-teal-700 transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors btn-3d"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-500 hover:text-teal-600 focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/about"
                className="text-gray-600 hover:text-teal-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/resources"
                className="text-gray-600 hover:text-teal-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/chat"
                    className="text-gray-600 hover:text-teal-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chat
                  </Link>
                  <Link
                    to="/journal"
                    className="text-gray-600 hover:text-teal-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Journal
                  </Link>
                  <Link
                    to="/meditation"
                    className="text-gray-600 hover:text-teal-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meditation
                  </Link>
                  <Link
                    to="/breathing"
                    className="text-gray-600 hover:text-teal-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Breathing
                  </Link>
                  <Link
                    to="/mood-chart"
                    className="text-gray-600 hover:text-teal-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mood Chart
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-teal-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/chat-history"
                    className="text-gray-600 hover:text-teal-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chat History
                  </Link>
                  <button onClick={handleLogout} className="text-left text-red-600 hover:text-red-700 font-medium py-2">
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-teal-600 font-medium hover:text-teal-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors text-center btn-3d"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
