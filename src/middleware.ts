import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-url'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if admin route
  const isAdminRoute = /^\/[a-z]{2}\/admin/.test(pathname)
  const isLoginRoute = /^\/[a-z]{2}\/login/.test(pathname)

  // Skip auth in mock mode
  if (isMockMode) {
    return intlMiddleware(request)
  }

  if (isAdminRoute) {
    // Create Supabase client for auth check
    let response = NextResponse.next({ request })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const locale = pathname.split('/')[1] || 'tr'
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check admin profile
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      const locale = pathname.split('/')[1] || 'tr'
      const loginUrl = new URL(`/${locale}/login`, request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect logged-in users away from login page
  if (isLoginRoute) {
    let response = NextResponse.next({ request })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const locale = pathname.split('/')[1] || 'tr'
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(tr|en)/:path*'],
}
