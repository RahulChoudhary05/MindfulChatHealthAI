import { MessageSquare, BarChart2, BookOpen, Clock, PenTool, Moon } from "lucide-react"

const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-teal-600" />,
      title: "24/7 Chat Support",
      description:
        "Connect with our AI assistant anytime for emotional support, coping strategies, and mental health guidance.",
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-teal-600" />,
      title: "Mood Tracking",
      description:
        "Monitor your emotional wellbeing over time with our intuitive mood tracker and identify patterns in your mental health.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-teal-600" />,
      title: "Resource Library",
      description:
        "Access a curated collection of articles, videos, and guides on various mental health topics and coping strategies.",
    },
    {
      icon: <Clock className="h-8 w-8 text-teal-600" />,
      title: "Breathing Exercises",
      description:
        "Practice guided breathing techniques to reduce anxiety, manage stress, and promote relaxation in the moment.",
    },
    {
      icon: <PenTool className="h-8 w-8 text-teal-600" />,
      title: "Journaling Tools",
      description:
        "Express your thoughts and feelings through guided journaling prompts designed to promote self-reflection and emotional processing.",
    },
    {
      icon: <Moon className="h-8 w-8 text-teal-600" />,
      title: "Meditation Timer",
      description:
        "Use our customizable meditation timer with ambient sounds to develop mindfulness and improve your mental clarity.",
    },
  ]

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">Comprehensive Mental Health Tools</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MindfulChat  offers a suite of features designed to support your mental wellbeing journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-teal-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection
