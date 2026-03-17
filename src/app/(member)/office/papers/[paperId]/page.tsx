import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPaperById, getSubmissionsByPaper, getProfile } from '@/lib/mock/store'
import { getDemoUser } from '@/lib/mock/session'
import { StatusBadge } from '@/components/StatusBadge'
import { SubmissionHistory } from '@/components/SubmissionHistory'
import { requestRevision, approveAndSchedule, publishPaper } from './actions'

export default async function OfficePaperDetailPage({
  params,
}: {
  params: Promise<{ paperId: string }>
}) {
  const { paperId } = await params
  const currentUser = await getDemoUser()

  if (!currentUser || currentUser.role !== 'office') {
    notFound()
  }

  const paper = getPaperById(paperId)
  if (!paper) {
    notFound()
  }

  const submissions = getSubmissionsByPaper(paperId)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/office/papers" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>←</span> 事務局ダッシュボードに戻る
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <StatusBadge status={paper.status} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            ID: {paper.id}
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.4, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
          {paper.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>👤 <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{paper.author_name}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🏢 {paper.affiliation}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        
        {/* 左カラム：内容と履歴 */}
        <div>
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-text)' }}>
              アブストラクト
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>
              {paper.abstract}
            </p>
          </div>

          <SubmissionHistory submissions={submissions} />
        </div>

        {/* 右カラム：事務局操作パネル */}
        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            事務局アクション
          </h2>

          {(paper.status === 'submitted' || paper.status === 'resubmitted') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <form action={approveAndSchedule.bind(null, paper.id)}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#2dd4bf' }}>
                  承認して受理設定（公開待ち）へ
                </button>
              </form>
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />
              
              <form action={requestRevision.bind(null, paper.id)} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea 
                  name="feedback" 
                  rows={3} 
                  required
                  placeholder="差し戻し理由や修正指示を記入..."
                  className="form-input"
                  style={{ fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn" style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', width: '100%', justifyContent: 'center', fontWeight: 600 }}>
                  著者へ差し戻す (要修正)
                </button>
              </form>
            </div>
          )}

          {paper.status === 'scheduled' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                この論文は承認済みで公開待ちです。手動で即時公開を設定します。
              </p>
              <form action={publishPaper.bind(null, paper.id, 'members_only')}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  会員限定で公開する
                </button>
              </form>
              <form action={publishPaper.bind(null, paper.id, 'free_public')}>
                <button type="submit" className="btn" style={{ background: '#4ade80', color: '#111827', border: 'none', width: '100%', justifyContent: 'center', fontWeight: 600 }}>
                  一般公開する (誰でも閲覧可能)
                </button>
              </form>
            </div>
          )}

          {(paper.status === 'published_members_only' || paper.status === 'free_public') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                ✓ 現在公開中です
              </p>
              {paper.status === 'published_members_only' && (
                <form action={publishPaper.bind(null, paper.id, 'free_public')}>
                  <button type="submit" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}>
                    一般公開に変更する
                  </button>
                </form>
              )}
              {paper.status === 'free_public' && (
                <form action={publishPaper.bind(null, paper.id, 'members_only')}>
                  <button type="submit" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}>
                    会員限定公開に変更する
                  </button>
                </form>
              )}
            </div>
          )}

          {(paper.status === 'draft') && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              著者が下書き中のため操作できません。
            </p>
          )}
          
          {(paper.status === 'archived') && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              アーカイブ済みのため操作は終了しています。
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
