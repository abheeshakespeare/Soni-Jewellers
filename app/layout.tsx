import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import { WishlistProvider } from "@/contexts/wishlist-context"
import WhatsAppButton from "@/app/whatsapp/WhatsAppButton"
import BumperOffer from "@/app/Offer/BumperOffer";


const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Soni Jewellers And Navratna Bhandar | Latehar",
  description: "Luxury jewellery for every occasion in Latehar, Jharkhand. Explore gold, silver, and custom jewellery at Soni Jewellers.",
  keywords: [
    "soni jewellers and navratna bhandar",
    "soni jewellers",
    "soni jewellers latehar",
    "latehar jewellery shop",
    "jewellery shop Latehar",
    "gold jewellery",
    "silver jewellery",
    "Soni Navratna Jewellers",
    "custom jewellery Latehar"
  ],
  metadataBase: new URL("https://www.soninavratnajewellers.in"), 
  openGraph: {
    title: "Soni Jewellers And Navratna Bhandar | Latehar",
    description: "Premium jewellery showroom based in Latehar District. Elegant designs for every moment.",
    url: "https://www.soninavratnajewellers.in",
    siteName: "Soni Jewellers",
    images: [
      {
        url: "https://www.soninavratnajewellers.in/logo.png",
        width: 1200,
        height: 630,
        alt: "Soni Jewellers Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soni Jewellers And Navratna Bhandar | Latehar",
    description: "Explore timeless jewellery pieces crafted in Latehar. Pure gold, pure elegance.",
    images: ["https://www.soninavratnajewellers.in/logo.png/logo.png"],
  }
};


// Add custom styles for toast on desktop
const toastStyles = {
  backgroundColor: "gold",
  color: "black",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <WishlistProvider>
          <BumperOffer />
          <Navbar />
          <div className="relative bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-black font-semibold shadow-md overflow-hidden">
  <div className="marquee-track">
    {/* First Copy */}
    <div className="marquee-content">
      <span>🎉 Soni Jewellers and Navratna Bhandar Mega Opening in Latehar On <strong>24th Sep, 2025</strong></span>
      <span>💎 Bumper Offer Coming Soon... Stay Connected!</span>
      <span>📢 Keep Checking the Website for the Mega Offer</span>
    </div>

    {/* Second Copy */}
    <div className="marquee-content" aria-hidden="true">
      <span>🎉 Soni Jewellers and Navratna Bhandar Mega Opening in Latehar On <strong>24th Sep, 2025</strong></span>
      <span>💎 Bumper Offer Coming Soon... Stay Connected!</span>
      <span>📢 Keep Checking the Website for the Mega Offer</span>
    </div>
  </div>
</div>

          <main className="min-h-screen">{children}</main>
          <Suspense fallback={<Skeleton className="h-40" />}>
            <Footer />
          </Suspense>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: toastStyles,
              classNames: {
                toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg md:w-[420px] md:p-6 md:text-lg",
                description: "group-[.toast]:text-zinc-500 md:text-base",
                actionButton: "group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50",
                cancelButton: "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500",
              },
            }}
            className="toaster"
          />
          <WhatsAppButton/>
        </WishlistProvider>
        
      </body>
    </html>
  )
}
