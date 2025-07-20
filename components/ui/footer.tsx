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
              <span className="text-yellow-500 text-2xl font-bold">Soni Navratna Jewellers<br/>
              </span>
            </div>
            <div className="flex space-x-4">
              <address className="text-gray-400">
                <p>Opp. V-Mart, Main Road Latehar, Jharkhand</p>
                <p>Phone: 9334997066, 9263879884</p>
                <p>Email: support@sonijewellers.com</p>
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
                <Link href="/collections" className="text-gray-400 hover:text-white">
                  Collections
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
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-gray-400 hover:text-white underline underline-offset-2">Privacy Policy</button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Privacy Policy</DialogTitle>
                      <DialogDescription>
                        <div className="max-h-[60vh] overflow-y-auto text-gray-700 text-sm p-2">
                          <p><b>Privacy Policy</b></p>
                          <p>Your privacy is important to us. We collect and use your information only for order processing, payment, and customer support. We do not share your personal data with third parties except as required by law or payment processors. All payment transactions are encrypted and processed securely in compliance with RBI and payment gateway norms. You may review, update, or request deletion of your data at any time by contacting us at support@sonijewellers.com.</p>
                          <ul className="list-disc pl-5 mt-2">
                            <li>We do not store your card or payment details on our servers.</li>
                            <li>All payments are processed through secure, PCI DSS-compliant gateways.</li>
                            <li>We comply with all applicable data protection and privacy laws of India.</li>
                          </ul>
                          <p className="mt-2">For more information, contact us at support@sonijewellers.com.</p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-gray-400 hover:text-white underline underline-offset-2">Terms of Service</button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Terms of Service</DialogTitle>
                      <DialogDescription>
                        <div className="max-h-[60vh] overflow-y-auto text-gray-700 text-sm p-2">
                          <p><b>Terms of Service</b></p>
                          <ul className="list-disc pl-5 mt-2">
                            <li>By placing an order, you agree to our payment, shipping, and return policies.</li>
                            <li>All advance payments are processed securely via authorized payment gateways.</li>
                            <li>Orders are confirmed only after successful payment authorization.</li>
                            <li>We reserve the right to cancel orders in case of payment failure, fraud, or policy violations.</li>
                            <li>Refunds, if applicable, will be processed as per RBI and payment gateway guidelines.</li>
                            <li>All disputes are subject to Latehar, Jharkhand jurisdiction.</li>
                          </ul>
                          <p className="mt-2">For full details, please contact us at support@sonijewellers.com.</p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
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
