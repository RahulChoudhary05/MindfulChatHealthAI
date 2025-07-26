"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    role: "Student",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "MindfulChat  has been a lifesaver during my exam stress. The breathing exercises and supportive chat helped me manage my anxiety when I needed it most.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael T.",
    role: "Software Engineer",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "As someone who works long hours, I appreciate having a tool that helps me check in with my mental health. The mood tracking feature has helped me identify patterns in my stress levels.",
    rating: 4,
  },
  {
    id: 3,
    name: "Elena R.",
    role: "Healthcare Worker",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "After long shifts, I often use the meditation timer to unwind. The AI chat provides thoughtful responses when I need someone to talk to about work stress.",
    rating: 5,
  },
  {
    id: 4,
    name: "David K.",
    role: "Retail Manager",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The journaling prompts have helped me process difficult emotions and gain perspective. I've noticed a real improvement in my overall wellbeing since using MindfulChat .",
    rating: 5,
  },
]

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="bg-teal-800 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            Hear from people who have made MindfulChat  part of their mental wellness routine
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-lg p-8 shadow-lg">
                      <div className="flex items-center mb-6">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full mr-4 object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                          <p className="text-gray-600">{testimonial.role}</p>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg text-teal-800 hover:bg-teal-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg text-teal-800 hover:bg-teal-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? "bg-white" : "bg-teal-200"
                } transition-colors`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialsSection
