import Link from "next/link"
import { Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/logo.png"
                alt="Soni Jewellers Logo"
                className="h-14 w-14 rounded-full border-2 border-yellow-800 shadow-md"
                style={{ filter: 'contrast(1.3)', background: 'white' }}
              />
              <span className="text-yellow-500 text-xl font-bold">Soni Jewellers And Navratna Bhandar<br/>
              </span>
            </div>
            <div className="flex space-x-4">
              <address className="text-gray-400">
                <p>Opp. V-Mart, Main Road Latehar, Jharkhand</p>
                <p>Phone: 9334997066, 9263879884</p>
                <p>Email: sonijewellers070@gmail.com</p>
              </address>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  All Products
                </Link>
              </li>
              
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-gray-400 hover:text-white">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal (was Customer Care) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-400 hover:text-white underline underline-offset-2">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white underline underline-offset-2">Privacy Policy</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white underline underline-offset-2">Shipping Policy</Link></li>
              <li><Link href="/refund" className="text-gray-400 hover:text-white underline underline-offset-2">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About the Developer</h3>
            <p className="text-gray-400 mb-2">Abhishek Mishra</p>
            <p className="text-gray-400 mb-4">
              For inquiries or collaborations, feel free to reach out through the following platforms:
            </p>
            <div className="flex space-x-4">
              <Link
                href="http://t.me/abheeshakespeare"
                className="text-gray-400 hover:text-[#99ccc8]"
                target="_blank"
              >
                <i className="bi bi-telegram text-xl"></i>
              </Link>
              <Link
                href="https://www.linkedin.com/in/abheeshakespeare"
                className="text-gray-400 hover:text-[#99ccc8]"
                target="_blank"
              >
                <i className="bi bi-linkedin text-xl"></i>
              </Link>
              <Link
                href="https://www.instagram.com/abheeshakespeare?igsh=bHZocXRhbnh5a2Q="
                className="text-gray-400 hover:text-[#99ccc8]"
                target="_blank"
              >
                <i className="bi bi-instagram text-xl"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Soni Jewellers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
