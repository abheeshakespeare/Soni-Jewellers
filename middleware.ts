import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()

  // If accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect unauthenticated users to login page
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (userData?.role !== 'admin') {
      // Redirect non-admin users to home page
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect user-specific routes
  if (
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/orders") ||
    request.nextUrl.pathname.startsWith("/wishlist")
  ) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth", request.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*", "/wishlist/:path*"],
}
