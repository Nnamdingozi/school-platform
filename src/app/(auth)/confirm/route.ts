import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  
  // Where to send the user after successful confirmation
  const next = '/dashboard' 

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Success! Redirect to the dashboard
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Failure: Redirect to login with an error message
  return NextResponse.redirect(new URL('/login?error=Invalid link', request.url))
}