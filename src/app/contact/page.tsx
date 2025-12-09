'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Message sent successfully!'
        })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.'
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="prose max-w-none mb-8">
            <p className="text-lg">
              Have questions about our firewood products or delivery service? 
              We're here to help! Get in touch with us using any of the methods below.
            </p>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-3">📞</span>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p>+44 7878 779622</p>
                  <p className="text-sm text-gray-600">Monday-Friday: 9am-5pm</p>
                  <a 
                    href="https://wa.me/447878779622" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 text-sm"
                  >
                    Contact us on WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📧</span>
                <div>
                  <p className="font-semibold">Email</p>
                  <p>support@firewoodlogsfuel.com</p>
                  <a 
                    href="mailto:support@firewoodlogsfuel.com"
                    className="text-amber-600 hover:text-amber-700 text-sm"
                  >
                    Send us an email
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📍</span>
                <div>
                  <p className="font-semibold">Service Area</p>
                  <p>Premium firewood delivery across the UK</p>
                  <p className="text-sm text-gray-600">Contact us for delivery to your area</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📱</span>
                <div>
                  <p className="font-semibold">Follow Us</p>
                  <a 
                    href="https://www.facebook.com/profile.php?id=61566871931156"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 text-sm"
                  >
                    Follow us on Facebook
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            {submitStatus.type && (
              <div className={`mb-4 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors disabled:bg-amber-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
