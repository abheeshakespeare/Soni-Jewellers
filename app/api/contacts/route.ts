import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const data = await req.json()
  const { name, email, phone, message } = data
  const { error } = await supabase.from('contacts').insert([{ name, email, phone, message, is_complete: false }])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
} 