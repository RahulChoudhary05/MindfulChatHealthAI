import { Link } from "react-router-dom"
import { Edit2, Clock, Activity, Moon, MessageSquare, ArrowRight } from "lucide-react"

const HomeShowcase = () => {
  const features = [
    {
      title: "Journal",
      description: "Record your thoughts and feelings to track your mental health journey.",
      icon: <Edit2 className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-100",
      link: "/journal",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Meditation",
      description: "Guided sessions to help you relax, focus, and find inner peace.",
      icon: <Moon className="h-8 w-8 text-indigo-500" />,
      color: "bg-indigo-100",
      link: "/meditation",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Mood Tracking",
      description: "Monitor your emotional patterns to better understand your mental health.",
      icon: <Activity className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-100",
      link: "/mood-chart",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Breathing Exercises",
      description: "Simple techniques to reduce stress and anxiety in the moment.",
      icon: <Clock className="h-8 w-8 text-teal-500" />,
      color: "bg-teal-100",
      link: "/breathing",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="ttext-3xl md:text-4xl font-bold text-teal-900 mb-4">Comprehensive Mental Health Tools</h2>
          <p className="ext-xl text-teal-700 max-w-3xl mx-auto">
            MindfulChat  offers a variety of features designed to support your mental wellbeing journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                  </div>
                  <Link
                    to={feature.link}
                    className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800"
                  >
                    Try it now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                {/* <div className="md:w-1/2">
                  <img
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div> */}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-teal-50 rounded-xl shadow-xl p-8 text-teal-900">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-4">Ready to start your mental health journey?</h3>
              <p className="mb-6">
                Our AI-powered chat assistant is available 24/7 to provide support, resources, and guidance.
              </p>
              <Link
                to="/chat"
                className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Chatting Now
              </Link>
            </div>
            <div className="md:w-1/3">
              <img src="/placeholder.svg?height=200&width=200" alt="AI Chat Assistant" className="w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeShowcase
