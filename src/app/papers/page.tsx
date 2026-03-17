import { getPublishedPapers, statusLabel } from '@/lib/mock/store'
import Link from 'next/link'
import type { Paper } from '@/types'

export default async function PapersPage() {
  const papers = getPublishedPapers()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
    }}>
      {/* ヘッダー */}
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="header-logo">
            Research <span>Session</span> Hub
          </Link>
          <nav className="header-nav">
            <Link href="/papers">論文一覧</Link>
          </nav>
          <div className="header-right">
            <Link href="/login" className="btn btn-secondary btn-sm">ログイン</Link>
          </div>
        </div>
      </header>

      <div className="page">
        <div className="page-header">
          <h1 className="page-title">論文一覧</h1>
          <p className="page-subtitle">公開中の研究発表論文</p>
        </div>

        {papers.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">公開中の論文はありません</p>
            <p className="empty-state-desc">現在公開されている論文がありません。</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {papers.map((paper: Paper) => (
              <div key={paper.id} className="card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                      <span className={`badge badge-${paper.status}`}>
                        {statusLabel(paper.status)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '2px 8px', borderRadius: 4 }}>
                        {paper.category}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      {paper.title}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                      {paper.abstract.slice(0, 180)}…
                    </p>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span>著者：{paper.author_name}</span>
                      <span>所属：{paper.affiliation}</span>
                      {paper.published_at && (
                        <span>公開日：{new Date(paper.published_at).toLocaleDateString('ja-JP')}</span>
                      )}
                    </div>
                  </div>
                  <Link href={`/papers/${paper.id}`} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                    詳細を見る
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
