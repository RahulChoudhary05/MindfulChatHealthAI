"use client"

import { useState } from "react"
import { ExternalLink, BookOpen, Video, FileText, Download } from "lucide-react"

const ResourcesPanel = ({ resources = [] }) => {
  const [filter, setFilter] = useState("All")

  // If no resources are provided, use these default resources
  const defaultResources = [
    {
      title: "Understanding Anxiety",
      description: "Learn about the symptoms and management of anxiety disorders",
      type: "Article",
      url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
      category: "Anxiety",
    },
    {
      title: "Mindfulness Meditation Guide",
      description: "A beginner's guide to mindfulness meditation practices",
      type: "Guide",
      url: "https://www.mindful.org/meditation/mindfulness-getting-started/",
      category: "Mindfulness",
    },
    {
      title: "Deep Breathing Exercise",
      description: "5-minute guided breathing exercise for stress relief",
      type: "Video",
      url: "https://www.youtube.com/watch?v=acUZdGd_3Gk",
      category: "Stress",
    },
  ]

  const displayResources = resources.length > 0 ? resources : defaultResources

  // Get unique categories for filter
  const categories = ["All", ...new Set(displayResources.map((resource) => resource.category))]

  // Filter resources by category
  const filteredResources =
    filter === "All" ? displayResources : displayResources.filter((resource) => resource.category === filter)

  // Get icon based on resource type
  const getIcon = (type) => {
    switch (type) {
      case "Article":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "Video":
        return <Video className="h-5 w-5 text-red-500" />
      case "Guide":
        return <BookOpen className="h-5 w-5 text-green-500" />
      case "Download":
        return <Download className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-teal-700 text-white p-4">
        <h2 className="text-xl font-semibold">Helpful Resources</h2>
        <p className="text-sm text-teal-100">Curated content for your wellbeing</p>
      </div>

      <div className="p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === category ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredResources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">{getIcon(resource.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-teal-800">{resource.title}</h3>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{resource.type}</span>
                    <span className="text-xs px-2 py-1 bg-teal-100 rounded-full text-teal-800 ml-2">
                      {resource.category}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}

          {filteredResources.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>No resources found for this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResourcesPanel
