import { Brain, Heart, Shield } from "lucide-react"
import MindfulChatParticles from "./mindful-chat-logo-particles"

const HeroSection = () => {
  return (
    <div className="relative bg-[#134E4A]">
      <div className="container mx-auto relative z-10">
        <MindfulChatParticles />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-teal-800/50">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Support</h3>
            <p className="text-teal-100">
              Our advanced AI understands your emotions and provides personalized support based on evidence-based
              techniques.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-teal-800/50">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Private & Secure</h3>
            <p className="text-teal-100">
              Your conversations are private and secure. We prioritize your confidentiality and data protection.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-teal-800/50">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Holistic Approach</h3>
            <p className="text-teal-100">
              Beyond chat support, access guided meditations, mood tracking, and evidence-based resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
