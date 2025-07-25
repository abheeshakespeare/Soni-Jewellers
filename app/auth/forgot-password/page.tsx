"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Crown } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const supabase = createClient()

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback` // or your desired callback page
        }
      })

      if (error) {
        console.error("Magic link error:", error)
        toast.error(error.message)
      } else {
        toast.success("If an account exists with this email, you will receive a magic link to sign in.")
        setEmail("")
      }
    } catch (error) {
      console.error("Magic link request error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center py-8 px-2 sm:px-4 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        {/* Elegant Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-block">
            <img
              src="/logo.png"
              alt="Soni Navratna Jewellers Logo"
              className="mx-auto h-14 w-14 rounded-full border-2 border-yellow-800 shadow-md bg-white mb-3"
              style={{ filter: 'contrast(1.3)' }}
            />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Forgot Password
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-base font-light">Enter your email to receive a password reset link</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 max-w-full mx-auto">
          {/* Gradient Bar at Top */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-t-2xl mb-0" />
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="Enter your email address"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Magic Link"}
              </Button>
              <div className="text-center mt-4">
                <Link 
                  href="/auth" 
                  className="text-sm text-yellow-600 hover:text-yellow-700"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 