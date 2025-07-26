"use client"
import { Link } from "react-router-dom"
import { MessageSquare, Brain, Wind, BarChart2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import HeroSection from "../components/HeroSection"
import FeaturesSection from "../components/FeaturesSection"
import TestimonialsSection from "../components/TestimonialsSection"
import HomeShowcase from "../components/HomeShowcase"

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-b from-[#e0f7fa] via-[#f0fdfa] to-[#e0e7ff] min-h-screen">
      {/* Hero Section with Particles */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-20 container mx-auto px-4"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-4 tracking-tight drop-shadow-sm">
            Comprehensive Mental Health Tools
          </h2>
          <p className="text-2xl text-teal-700 max-w-3xl mx-auto font-light">
            MindfulChat  offers a suite of features designed to support your mental wellbeing journey.
          </p>
        </motion.div>

        <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-xl border border-teal-100 text-center hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-6 shadow-md">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold text-teal-900 mb-3">AI Chat Support</h3>
            <p className="text-teal-700 text-lg font-light">
              24/7 conversational support to help you process emotions and find coping strategies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl border border-blue-100 text-center hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6 shadow-md">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-3">Journaling</h3>
            <p className="text-blue-700 text-lg font-light">
              Record your thoughts and feelings to track patterns and gain personal insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl shadow-xl border border-cyan-100 text-center hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 text-cyan-600 mb-6 shadow-md">
              <Wind className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold text-cyan-900 mb-3">Breathing Exercises</h3>
            <p className="text-cyan-700 text-lg font-light">
              Guided breathing techniques to reduce stress and promote relaxation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-xl border border-indigo-100 text-center hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-6 shadow-md">
              <BarChart2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold text-indigo-900 mb-3">Mood Tracking</h3>
            <p className="text-indigo-700 text-lg font-light">
              Visualize your emotional patterns and gain insights into your mental wellbeing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#e0f2fe] via-[#f0fdfa] to-[#e0e7ff]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-20 container mx-auto px-4"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-4 tracking-tight drop-shadow-sm">
            How It Works
          </h2>
          <p className="text-2xl text-teal-700 max-w-3xl mx-auto font-light">
            MindfulChat  provides a comprehensive approach to mental health support.
          </p>
        </motion.div>

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/90 p-8 rounded-2xl shadow-lg border border-teal-100 text-center"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-teal-600 text-white font-bold mb-6 text-2xl shadow-md">
                1
              </div>
              <h3 className="text-xl font-semibold text-teal-900 mb-3">Connect with AI</h3>
              <p className="text-teal-700 text-lg font-light">
                Chat with our AI assistant about your thoughts, feelings, or challenges you're facing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/90 p-8 rounded-2xl shadow-lg border border-teal-100 text-center"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-teal-600 text-white font-bold mb-6 text-2xl shadow-md">
                2
              </div>
              <h3 className="text-xl font-semibold text-teal-900 mb-3">Use Wellness Tools</h3>
              <p className="text-teal-700 text-lg font-light">
                Practice meditation, breathing exercises, journaling, and mood tracking to support your mental health.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/90 p-8 rounded-2xl shadow-lg border border-teal-100 text-center"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-teal-600 text-white font-bold mb-6 text-2xl shadow-md">
                3
              </div>
              <h3 className="text-xl font-semibold text-teal-900 mb-3">Track Your Progress</h3>
              <p className="text-teal-700 text-lg font-light">
                Monitor your emotional patterns and wellbeing journey through visualizations and insights.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <HomeShowcase />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="py-20 md:py-28 text-center bg-gradient-to-br from-teal-800 via-teal-700 to-blue-900 text-white"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight drop-shadow-sm">Ready to Start Your Journey?</h2>
          <p className="text-2xl text-teal-100 max-w-3xl mx-auto mb-10 font-light">
            Begin a conversation with MindfulChat  and take a step towards better mental wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/signup"
              className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold flex items-center justify-center hover:bg-purple-700 transition-colors text-lg shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-purple-400 text-purple-100 rounded-xl font-semibold flex items-center justify-center hover:bg-purple-50 hover:text-purple-700 transition-colors text-lg shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default LandingPage
