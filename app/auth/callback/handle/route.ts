import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // After successful code exchange, redirect to the client-side callback page (no code in URL)
      return NextResponse.redirect(`${origin}/auth/callback`)
    }
  }

  // If no code or error, redirect to auth page
  return NextResponse.redirect(`${origin}/auth`)
} 