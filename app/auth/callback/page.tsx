"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    let didRedirect = false;
    const handleAuthCallback = async () => {
      try {
        // Get the session (should be set by server-side code exchange)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (didRedirect) return;
        if (sessionError) {
          toast.error("Session error. Please try again.")
          router.replace('/auth')
          didRedirect = true;
          return
        }

        if (!session?.user) {
          toast.error("No session found. Please sign in again.")
          router.replace('/auth')
          didRedirect = true;
          return
        }

        // Check if user exists in our users table
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle()

        if (didRedirect) return;
        if (userError) {
          toast.error("Error checking user profile.")
          router.replace('/')
          didRedirect = true;
          return
        }

        if (!existingUser) {
          // Create new user record
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.full_name ||
                    session.user.user_metadata.name ||
                    session.user.email?.split('@')[0] || '',
              role: 'customer',
              address: {
                street: "",
                city: "",
                state: "",
                pincode: ""
              },
              phone: "",
              avatar_url: session.user.user_metadata.avatar_url || null
            })

          if (insertError) {
            toast.error("Error setting up your profile. Please contact support.")
          } else {
            toast.success("Account created successfully!")
          }
          router.replace('/')
          didRedirect = true;
        } else {
          toast.success("Welcome back!")
          router.replace('/')
          didRedirect = true;
        }
      } catch (error) {
        if (!didRedirect) {
          toast.error("An unexpected error occurred. Please try again.")
          router.replace('/auth')
          didRedirect = true;
        }
      } finally {
        setIsProcessing(false)
      }
    }

    // Timeout fallback: always redirect after 2s if not already redirected
    const timeout = setTimeout(() => {
      if (!didRedirect) {
        router.replace('/')
        didRedirect = true;
      }
    }, 2000)

    handleAuthCallback()
    return () => clearTimeout(timeout)
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-4">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
        {!isProcessing && (
          <p className="text-sm text-gray-500 mt-4">
            If you're not redirected automatically, <a href="/" className="text-blue-600 hover:underline">click here</a>.
          </p>
        )}
      </div>
    </div>
  )
} 