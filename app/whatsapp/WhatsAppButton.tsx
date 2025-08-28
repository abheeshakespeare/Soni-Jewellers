"use client"
import { FaWhatsapp } from "react-icons/fa"

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/9334997066" // Replace with your number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg 
                 hover:bg-green-600 transition-all duration-300 
                 animate-bounce hover:scale-110"
    >
      <FaWhatsapp size={28} />
    </a>
  )
}
