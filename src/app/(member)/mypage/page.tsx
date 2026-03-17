import { redirect } from 'next/navigation'
import { getDemoUser } from '@/lib/mock/session'

export default async function MypagePage() {
  const profile = await getDemoUser()
  if (!profile) redirect('/login')

  const roleLabel: Record<string, string> = {
    viewer:    '閲覧者',
    presenter: '研究発表者',
    office:    '事務局',
  }

  const roleColor: Record<string, { bg: string; color: string }> = {
    viewer:    { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
    presenter: { bg: 'rgba(34,197,94,0.2)',    color: '#4ade80' },
    office:    { bg: 'rgba(99,102,241,0.2)',   color: '#a5b4fc' },
  }
  const roleBadge = roleColor[profile.role] ?? roleColor.viewer

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">マイページ</h1>
        <p className="page-subtitle">アカウント情報の確認</p>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <dl style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <dt style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>表示名</dt>
            <dd style={{ fontSize: '1rem', fontWeight: 600 }}>{profile.display_name}</dd>
          </div>
          <div>
            <dt style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>所属</dt>
            <dd style={{ fontSize: '1rem' }}>{profile.affiliation ?? '（未設定）'}</dd>
          </div>
          <div>
            <dt style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>ロール</dt>
            <dd>
              <span className="badge" style={roleBadge}>
                {roleLabel[profile.role] ?? profile.role}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* デモ操作バナー */}
      <div className="alert alert-info" style={{ marginTop: '2rem', maxWidth: 520 }}>
        <strong>デモモード</strong>：ログインアカウントを切り替えるには一度ログアウトして別のデモアカウントでログインしてください。
      </div>
    </div>
  )
}
