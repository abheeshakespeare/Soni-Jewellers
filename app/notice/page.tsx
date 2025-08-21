"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OrderNoticeModalProps {
  open?: boolean
  onClose?: () => void
}

export default function OrderNoticeModal({ open, onClose }: OrderNoticeModalProps) {
  const isOpen = open ?? true
  const handleClose = onClose ?? (() => {})
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-amber-800 text-xl font-bold">
            Soni Jewellers and Navratna Bhandar
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            We are not currently taking orders online through this site.
            You can select products from the Website and contact the shop to buy offline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold">📞 Get in Touch</h4>
            <p>Customer Support (24/7)</p>
            <p className="text-amber-700">+91 9334997066</p>
            <p className="text-amber-700">+91 9263879884</p>
            <p>Email: <span className="text-amber-700">sonijewellers070@gmail.com</span></p>
          </div>
          <div>
            <h4 className="font-semibold">🕒 Business Hours</h4>
            <p>Sunday - Saturday: 10:00 AM - 7:00 PM</p>
          </div>
          <div>
            <h4 className="font-semibold">🏬 Visit Our Store</h4>
            <p>Opp. V-Mart, Main Road</p>
            <p>Latehar, Jharkhand</p>
            <p>Phone: 9334997066, 9263879884</p>
            <p>Email: sonijewellers070@gmail.com</p>
          </div>
        </div>

        <DialogFooter>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button onClick={onClose} className="bg-yellow-600 hover:bg-yellow-700 text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
