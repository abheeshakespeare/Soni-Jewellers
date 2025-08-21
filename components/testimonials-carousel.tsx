"use client"

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    text: "The quality of jewelry is exceptional. I've been a customer for years and never been disappointed. The craftsmanship is outstanding!",
    name: "Sarah Patel",
    role: "Loyal Customer",
    initials: "SP"
  },
  {
    id: 2,
    text: "Amazing collection and excellent service. The staff helped me find the perfect piece for my wedding. Highly recommended!",
    name: "Rajesh Kumar",
    role: "Wedding Customer",
    initials: "RK"
  },
  {
    id: 3,
    text: "The online shopping experience is seamless. Fast delivery and the jewelry exceeded my expectations. Will definitely shop again!",
    name: "Aisha Mehta",
    role: "Online Customer",
    initials: "AM"
  }
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const showTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="md:hidden">
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0">
                <div className="bg-white p-6 rounded-xl shadow-lg mx-4">
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.initials}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-yellow-600' : 'bg-gray-300'
              }`}
              onClick={() => showTestimonial(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 