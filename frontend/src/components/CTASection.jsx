import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-teal-700 to-teal-900 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to prioritize your mental wellbeing?</h2>
        <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
          Join thousands of users who have made MindfulChat  part of their self-care routine.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/signup"
            className="px-8 py-3 bg-white text-teal-800 rounded-lg font-medium flex items-center justify-center hover:bg-teal-50 transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/chat"
            className="px-8 py-3 border border-white text-white rounded-lg font-medium flex items-center justify-center hover:bg-teal-800 transition-colors"
          >
            Try Demo
          </Link>
        </div>
        <p className="mt-6 text-teal-200 text-sm">No credit card required. Start your journey today.</p>
      </div>
    </div>
  )
}

export default CTASection
