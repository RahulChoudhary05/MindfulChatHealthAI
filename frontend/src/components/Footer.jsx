import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Mail, Heart } from "lucide-react"
import MindfulChatLogo from "./MindfulChatLogo"

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <MindfulChatLogo className="h-10 w-10 mr-2" />
              <span className="text-xl font-bold">MindfulChat </span>
            </div>
            <p className="text-teal-200 mb-4">
              Your compassionate AI companion for mental wellness and emotional support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-teal-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-teal-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-teal-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:contact@MindfulChat .com" className="text-teal-200 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-teal-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-teal-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-teal-200 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-teal-200 hover:text-white transition-colors">
                  Chat Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-teal-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-teal-200 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="text-teal-200 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-teal-200 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Crisis Resources</h3>
            <ul className="space-y-2">
              <li className="text-teal-200">
                <strong>National Suicide Prevention Lifeline:</strong>
                <br />
                <a href="tel:988" className="hover:text-white transition-colors">
                  988
                </a>
              </li>
              <li className="text-teal-200">
                <strong>Crisis Text Line:</strong>
                <br />
                Text HOME to{" "}
                <a href="sms:741741" className="hover:text-white transition-colors">
                  741741
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-teal-800 mt-8 pt-6 text-center text-teal-300">
          <p className="flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-400" /> by MindfulChat  Team &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
