"use client"

import { useState } from "react"
import { Search, BookOpen, Video, FileText, Activity } from "lucide-react"

const resources = [
  {
    id: 1,
    title: "Understanding Anxiety: A Comprehensive Guide",
    description:
      "Learn about the different types of anxiety disorders, their symptoms, and evidence-based treatment options.",
    type: "Article",
    category: "Anxiety",
    url: "https://www.helpguide.org/articles/anxiety/anxiety-disorders-and-anxiety-attacks.htm",
    icon: FileText,
  },
  {
    id: 2,
    title: "5-Minute Mindfulness Meditation",
    description: "A quick guided meditation practice to help reduce stress and increase present-moment awareness.",
    type: "Exercise",
    category: "Mindfulness",
    url: "https://www.mindful.org/a-five-minute-breathing-meditation/",
    icon: Activity,
  },
  {
    id: 3,
    title: "Cognitive Behavioral Therapy Techniques",
    description: "Practical CBT strategies you can use to challenge negative thought patterns and improve your mood.",
    type: "Guide",
    category: "Depression",
    url: "https://www.verywellmind.com/cognitive-behavioral-therapy-techniques-5120243",
    icon: FileText,
  },
  {
    id: 4,
    title: "Sleep Hygiene: Improving Your Sleep Quality",
    description: "Tips and strategies for developing healthy sleep habits and improving your overall sleep quality.",
    type: "Article",
    category: "Sleep",
    url: "https://www.sleepfoundation.org/sleep-hygiene",
    icon: FileText,
  },
  {
    id: 5,
    title: "Progressive Muscle Relaxation Tutorial",
    description:
      "A step-by-step guide to progressive muscle relaxation, a technique to reduce physical tension and stress.",
    type: "Video",
    category: "Stress",
    url: "https://www.youtube.com/watch?v=1nZEdqcGVzo",
    icon: Video,
  },
  {
    id: 6,
    title: "Journaling for Mental Health",
    description: "How keeping a journal can help you manage anxiety, reduce stress, and cope with depression.",
    type: "Guide",
    category: "Self-Care",
    url: "https://www.urmc.rochester.edu/encyclopedia/content.aspx?ContentID=4552&ContentTypeID=1",
    icon: FileText,
  },
  {
    id: 7,
    title: "Breathing Exercises for Anxiety",
    description: "Simple breathing techniques you can practice anywhere to help manage anxiety and panic symptoms.",
    type: "Exercise",
    category: "Anxiety",
    url: "https://www.healthline.com/health/breathing-exercises-for-anxiety",
    icon: Activity,
  },
  {
    id: 8,
    title: "Understanding Depression",
    description: "An overview of depression, including symptoms, causes, and treatment options.",
    type: "Article",
    category: "Depression",
    url: "https://www.nimh.nih.gov/health/topics/depression",
    icon: FileText,
  },
  {
    id: 9,
    title: "Guided Body Scan Meditation",
    description: "A 10-minute guided meditation to help you connect with your body and release tension.",
    type: "Exercise",
    category: "Mindfulness",
    url: "https://www.mindful.org/a-body-scan-meditation-to-help-you-sleep/",
    icon: Activity,
  },
  {
    id: 10,
    title: "Building Resilience",
    description: "Strategies to help you build resilience and cope with life's challenges.",
    type: "Guide",
    category: "Self-Care",
    url: "https://www.apa.org/topics/resilience",
    icon: FileText,
  },
  {
    id: 11,
    title: "Mindful Eating Practice",
    description: "Learn how to practice mindful eating to improve your relationship with food and reduce stress.",
    type: "Exercise",
    category: "Mindfulness",
    url: "https://www.healthline.com/nutrition/mindful-eating-guide",
    icon: Activity,
  },
  {
    id: 12,
    title: "Understanding Panic Attacks",
    description: "What panic attacks are, why they happen, and how to manage them effectively.",
    type: "Video",
    category: "Anxiety",
    url: "https://www.youtube.com/watch?v=XS5OhJ1-BmQ",
    icon: Video,
  },
]

const categories = ["All", "Anxiety", "Depression", "Mindfulness", "Stress", "Sleep", "Self-Care"]
const types = ["All", "Article", "Exercise", "Guide", "Video"]

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")

  // Filter resources based on search term, category, and type
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    const matchesType = selectedType === "All" || resource.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Mental Health Resources</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our curated collection of articles, exercises, and tools to support your mental wellbeing.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="mb-4 md:mb-0 md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredResources.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const Icon = resource.icon

              return (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                            resource.type === "Article"
                              ? "bg-blue-100 text-blue-600"
                              : resource.type === "Exercise"
                                ? "bg-green-100 text-green-600"
                                : resource.type === "Guide"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{resource.type}</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {resource.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-blue-800 mb-2">{resource.title}</h3>

                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>

                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      View Resource
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>

      {/* Crisis Resources */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-red-50 rounded-lg border border-red-100">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Crisis Resources</h2>
        <p className="text-gray-700 mb-4">
          If you're experiencing a mental health crisis or emergency, please reach out to one of these resources for
          immediate help:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-red-100">
            <h3 className="font-medium text-red-700 mb-1">National Suicide Prevention Lifeline</h3>
            <p className="text-gray-600 mb-2">24/7, free and confidential support</p>
            <p className="text-lg font-bold">988</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-red-100">
            <h3 className="font-medium text-red-700 mb-1">Crisis Text Line</h3>
            <p className="text-gray-600 mb-2">Text HOME to 741741</p>
            <p className="text-sm">Free 24/7 support from trained crisis counselors</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourcesPage
