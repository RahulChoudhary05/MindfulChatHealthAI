import { Shield, AlertCircle, Heart } from "lucide-react"

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6 text-center">About MindfulChat </h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          MindfulChat  was created to provide accessible mental health support to everyone, regardless of their location
          or circumstances. We believe that everyone deserves access to tools and resources that can help them navigate
          life's challenges and improve their mental wellbeing.
        </p>
        <p className="text-gray-700 mb-4">
          Our AI-powered chatbot is designed to offer emotional support, coping strategies, and helpful resources in a
          safe, private environment. While we are not a replacement for professional mental health care, we aim to be a
          supportive companion on your journey to better mental health.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">How We Help</h2>

        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800">Emotional Support</h3>
              <p className="text-gray-600 mt-1">
                Our AI is trained to provide empathetic responses that validate your feelings and experiences.
                Sometimes, just having someone to listen can make a difference.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800">Coping Strategies</h3>
              <p className="text-gray-600 mt-1">
                Based on your needs, we offer evidence-based coping strategies and techniques to help you manage stress,
                anxiety, and other challenging emotions.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800">Helpful Resources</h3>
              <p className="text-gray-600 mt-1">
                We provide access to a curated collection of articles, exercises, and tools that can support your mental
                health journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-blue-700">Our Commitment to Privacy</h2>
          </div>
          <p className="text-gray-700 mb-4">
            We take your privacy seriously. Your conversations with MindfulChat  are private and secure. We do not share
            your personal information with third parties, and we only collect anonymous data to improve our service.
          </p>
          <p className="text-gray-700">
            For more information, please see our{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-100">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-red-700">Important Disclaimer</h2>
          </div>
          <p className="text-gray-700 mb-4">
            MindfulChat  is not a substitute for professional mental health care. If you are experiencing a mental health
            crisis or emergency, please contact a mental health professional, go to your nearest emergency room, or call
            the National Suicide Prevention Lifeline at 988.
          </p>
          <p className="text-gray-700">
            Our AI assistant is designed to provide support and resources, but it cannot diagnose conditions or provide
            medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
