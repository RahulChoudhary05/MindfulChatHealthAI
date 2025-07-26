import { Shield, Lock, Eye } from "lucide-react"

const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6 text-center">Privacy Policy</h1>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-blue-700">Our Commitment to Privacy</h2>
          </div>
          <p className="text-gray-700 mb-4">
            At MindfulChat , we take your privacy seriously. This Privacy Policy explains how we collect, use, and
            protect your information when you use our service.
          </p>
          <p className="text-gray-700 mb-4">Last updated: May 14, 2023</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-blue-700">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">Chat Data</h3>
                <p className="text-gray-700">
                  We collect and store the content of your conversations with our AI assistant. This data is used to
                  provide and improve our service, and to train our AI models to better respond to your needs.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">Usage Information</h3>
                <p className="text-gray-700">
                  We collect information about how you use our service, including the features you use, the time and
                  duration of your sessions, and your interactions with our AI assistant.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">Device Information</h3>
                <p className="text-gray-700">
                  We collect information about the device you use to access our service, including the device type,
                  operating system, browser type, and IP address.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-blue-700">How We Use Your Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">Providing and Improving Our Service</h3>
                <p className="text-gray-700">
                  We use your information to provide, maintain, and improve our service, including to develop new
                  features and functionality.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">Training Our AI Models</h3>
                <p className="text-gray-700">
                  We use anonymized chat data to train our AI models to better understand and respond to user needs.
                  This helps us improve the quality and relevance of our AI assistant's responses.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">Research and Analytics</h3>
                <p className="text-gray-700">
                  We use aggregated and anonymized data for research and analytics purposes, including to understand how
                  users interact with our service and to identify trends and patterns.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your information from
              unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the
              Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to provide our service and fulfill the purposes
              outlined in this Privacy Policy. You can request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including the
              right to access, correct, delete, or restrict processing of your information. To exercise these rights,
              please contact us.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy
              Policy periodically for any changes.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us
              at:
            </p>
            <p className="text-gray-700">
              Email: privacy@MindfulChat .example.com
              <br />
              Address: 123 Mental Health Street, Wellness City, WC 12345
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
