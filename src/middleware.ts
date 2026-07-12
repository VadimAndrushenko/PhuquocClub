import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['ru', 'en']
const DEFAULT_LOCALE = 'ru'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAPI = pathname.startsWith('/api')
  const isAdmin = pathname.startsWith('/admin')
  const isStatic = pathname.startsWith('/_next')
  const isPayload = pathname.startsWith('/payload')
  const hasExt = pathname.includes('.') && !pathname.startsWith('/en.')

  if (isAPI || isAdmin || isStatic || isPayload || hasExt) {
    return NextResponse.next()
  }

  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0] || ''

  if (LOCALES.includes(firstSegment)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|admin|_next|payload|favicon).*)'],
}
