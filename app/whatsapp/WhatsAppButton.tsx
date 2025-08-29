"use client"
import { useEffect, useState } from "react"
import { FaWhatsapp } from "react-icons/fa"

export default function WhatsAppButton() {
  const [isBouncing, setIsBouncing] = useState(true)

  useEffect(() => {
    // Stop bouncing after 3 seconds
    const timer = setTimeout(() => {
      setIsBouncing(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <a
      href="https://wa.me/9334997066" // Replace with your number
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg 
                  hover:bg-green-600 transition-all duration-300 
                  hover:scale-110 ${isBouncing ? "animate-bounce" : ""}`}
    >
      <FaWhatsapp size={28} />
    </a>
  )
}
