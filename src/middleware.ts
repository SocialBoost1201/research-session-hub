/**
 * デモ用 Middleware
 * Supabase Auth を使用せず、Cookie ベースのデモセッションで認証をシミュレートする
 */

import { NextResponse, type NextRequest } from 'next/server'

// 認証不要なパス
const PUBLIC_PATHS = ['/', '/login', '/signup', '/papers']

// office のみアクセス可能なパス
const OFFICE_PATHS = ['/office']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 公開パスはそのまま通す
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // デモセッション確認
  const userId = request.cookies.get('demo_user_id')?.value
  const userRole = request.cookies.get('demo_user_role')?.value

  // 未ログイン → /login へリダイレクト
  if (!userId) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // office 限定パス → office 以外は /mypage へリダイレクト
  if (OFFICE_PATHS.some(p => pathname.startsWith(p))) {
    if (userRole !== 'office') {
      const url = request.nextUrl.clone()
      url.pathname = '/mypage'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
