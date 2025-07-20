import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "./types"
import { cache } from "react"

// Create a cached version of the Supabase client
export const createServerClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ 
    cookies: () => cookieStore
  })
})
