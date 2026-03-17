import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPaperById, getSubmissionsByPaper } from '@/lib/mock/store'
import { getDemoUser } from '@/lib/mock/session'
import { StatusBadge } from '@/components/StatusBadge'
import { SubmissionHistory } from '@/components/SubmissionHistory'

export default async function MyPaperDetailPage({
  params,
}: {
  params: Promise<{ paperId: string }>
}) {
  const { paperId } = await params
  const currentUser = await getDemoUser()

  if (!currentUser || currentUser.role !== 'presenter') {
    notFound()
  }

  const paper = getPaperById(paperId)
  if (!paper || paper.presenter_id !== currentUser.id) {
    notFound()
  }

  const submissions = getSubmissionsByPaper(paperId)

  return (
    <div style={{ maxWidth: 800 }}>
      {/* パンくずリスト風 */}
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/my/papers" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>←</span> 自分の投稿一覧に戻る
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <StatusBadge status={paper.status} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            カテゴリ: {paper.category}
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.4, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
          {paper.title}
        </h1>
      </div>

      {paper.status === 'revision_requested' && (
        <div className="alert alert-error" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f87171', marginBottom: '0.5rem' }}>
              事務局から修正の依頼があります
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#fca5a5' }}>
              提出履歴の詳細を確認し、修正稿を再提出してください。
            </p>
          </div>
          <Link href={`/my/papers/${paper.id}/resubmit`} className="btn" style={{ background: '#ef4444', color: '#fff', border: 'none', fontWeight: 600 }}>
            再提出する
          </Link>
        </div>
      )}

      {paper.status === 'draft' && (
        <div className="alert" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.2)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.5rem' }}>
              この投稿はまだ下書きです
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              必要な情報を入力して提出を完了してください。
            </p>
          </div>
          <Link href={`/my/papers/${paper.id}/submit`} className="btn btn-primary">
            編集・提出へ進む
          </Link>
        </div>
      )}

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-text)' }}>
          アブストラクト
        </h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>
          {paper.abstract}
        </p>
      </div>

      {/* 提出履歴 */}
      {submissions.length > 0 && (
        <SubmissionHistory submissions={submissions} />
      )}
    </div>
  )
}
