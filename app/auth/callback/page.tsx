"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session after the route handler has processed the code
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error during auth callback:', error)
          toast.error("Authentication error. Please try again.")
          router.replace('/auth')
          return
        }

        if (session?.user) {
          // Check if user exists in our users table
          const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (userError && userError.code === 'PGRST116') { // No rows returned
            // Create new user record with proper structure
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata.full_name || session.user.user_metadata.name,
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
              console.error('Error creating user record:', insertError)
              toast.error("Error setting up your profile. Please contact support.")
            } else {
              toast.success("Account created successfully!")
            }
            
            router.replace('/')
          } else if (userError) {
            console.error('Error checking user:', userError)
            toast.error("Error checking user profile. Please try again.")
            router.replace('/')
            return
          } else {
            // User exists, redirect based on role
            if (existingUser.role === 'admin') {
              router.replace('/admin')
            } else {
              router.replace('/')
            }
          }
        } else {
          toast.error("No session found. Please sign in again.")
          router.replace('/auth')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        toast.error("An unexpected error occurred. Please try again.")
        router.replace('/auth')
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-4">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  )
} 