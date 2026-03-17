import { redirect } from 'next/navigation'
import { getDemoUser } from '@/lib/mock/session'
import { logout } from '@/app/(auth)/actions'
import Link from 'next/link'
import type { Profile } from '@/types'

async function Header({ profile }: { profile: Profile }) {
  const roleLabel: Record<string, string> = {
    viewer: '閲覧者',
    presenter: '発表者',
    office: '事務局',
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          Research <span>Session</span> Hub
        </Link>

        <nav className="header-nav">
          <Link href="/papers">論文一覧</Link>
          {(profile.role === 'presenter' || profile.role === 'office') && (
            <Link href="/my/papers">マイ投稿</Link>
          )}
          {profile.role === 'office' && (
            <Link href="/office">管理画面</Link>
          )}
        </nav>

        <div className="header-right">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '2px 8px', borderRadius: 4 }}>
            {roleLabel[profile.role] ?? profile.role}
          </span>
          <Link href="/mypage" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            {profile.display_name}
          </Link>
          <form action={logout}>
            <button type="submit" className="btn btn-secondary btn-sm">
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getDemoUser()

  if (!profile) {
    redirect('/login')
  }

  return (
    <>
      <Header profile={profile} />
      <main>{children}</main>
    </>
  )
}
