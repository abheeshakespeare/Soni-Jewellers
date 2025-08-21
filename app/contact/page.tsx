"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'


export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to send message')
      toast.success("Message sent successfully! We'll get back to you soon.")
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 relative flex flex-col">
      
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="max-w-6xl mx-auto flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">Contact Us</h1>
            <p className="text-amber-700">We'd love to hear from you. Get in touch with our team.</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            {/* Contact Information - Left Side */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100 flex flex-col order-1">
              <h2 className="text-xl font-semibold text-amber-800 mb-4">Get in Touch</h2>
              
              <div className="space-y-4 flex-1">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">Customer Support</h3>
                    <p className="text-amber-700 text-sm mb-2">
                      Need help? Our support team is here for you 24/7.
                    </p>
                    <a 
                      href="tel:+919334997066"
                      className="text-amber-600 hover:text-amber-700 block mb-1 font-medium text-sm"
                    >
                      +91 9334997066
                    </a>
                    <a 
                      href="tel:+919263879884"
                      className="text-amber-600 hover:text-amber-700 block mb-1 font-medium text-sm"
                    >
                      +91 9263879884
                    </a>
                    <br/>
                    <a 
                      href="mailto:sonijewellers070@gmail.com"
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                    >
                      sonijewellers070@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">Business Hours</h3>
                    <p className="text-amber-700 text-sm">
                      Sunday - Saturday: 10:00 AM - 7:00 PM<br/>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">Visit Our Store</h3>
                    <p className="text-amber-700 text-sm">
                      Opp. V-Mart, Main Road Latehar, Jharkhand<br />
                      Phone: 9334997066, 9263879884<br />
                      Email: sonijewellers070@gmail.com
                    </p>  
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100 flex flex-col order-2">
              <h2 className="text-xl font-semibold text-amber-800 mb-4">Send us a Message</h2>
              
              <div className="space-y-4 flex-1">
                <div>
                  <Label htmlFor="name" className="text-amber-800 font-medium text-sm">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 border-amber-200 focus:border-amber-400 focus:ring-amber-400 h-10"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-amber-800 font-medium text-sm">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 border-amber-200 focus:border-amber-400 focus:ring-amber-400 h-10"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-amber-800 font-medium text-sm">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 border-amber-200 focus:border-amber-400 focus:ring-amber-400 h-10"
                    required
                  />
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="message" className="text-amber-800 font-medium text-sm">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 border-amber-200 focus:border-amber-400 focus:ring-amber-400 resize-none h-24"
                    placeholder="Tell us about your jewelry needs or any questions you have..."
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 h-10"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}