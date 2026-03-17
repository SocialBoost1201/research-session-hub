import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: 480, width: '100%', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          ページが見つかりません
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          お探しの論文やページは削除されたか、一時的にアクセスできない状態になっている可能性があります。
          または、閲覧権限がない可能性があります。
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/papers" className="btn btn-primary">
            公開論文一覧へ
          </Link>
          <Link href="/" className="btn btn-secondary">
            トップページへ
          </Link>
        </div>
      </div>
    </main>
  )
}
