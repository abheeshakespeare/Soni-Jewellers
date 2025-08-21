"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

function VerifyRecoveryInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const token_hash = searchParams.get("token_hash")
    const type = searchParams.get("type")

    if (token_hash && type === "recovery") {
      supabase.auth.verifyOtp({ type: "recovery", token_hash })
        .then(({ error }) => {
          if (error) {
            toast.error("Invalid or expired reset link. Please request a new one.")
            router.replace("/auth/forgot-password")
          } else {
            router.replace("/auth/reset-password")
          }
        })
        .finally(() => setLoading(false))
    } else {
      toast.error("Invalid reset link.")
      router.replace("/auth/forgot-password")
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">{loading ? "Verifying reset link..." : "Redirecting..."}</p>
      </div>
    </div>
  )
}

export default function VerifyRecoveryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    }>
      <VerifyRecoveryInner />
    </Suspense>
  )
} 