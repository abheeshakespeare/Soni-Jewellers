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

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Soni Jewellers",
  description: "Luxury jewellery for every occasion",
}

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
      </head>
      <body className={inter.className}>
        <WishlistProvider>
          <Navbar />
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
        </WishlistProvider>
      </body>
    </html>
  )
}
