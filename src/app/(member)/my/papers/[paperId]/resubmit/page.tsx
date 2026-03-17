import { notFound } from 'next/navigation'
import { getPaperById, getSubmissionsByPaper } from '@/lib/mock/store'
import { getDemoUser } from '@/lib/mock/session'
import Link from 'next/link'

export default async function ResubmitPage({
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
  if (!paper || paper.presenter_id !== currentUser.id || paper.status !== 'revision_requested') {
    notFound()
  }

  const submissions = getSubmissionsByPaper(paper.id)
  const latestSubmission = submissions[0]

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/my/papers/${paper.id}`} style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>←</span> 投稿詳細に戻る
        </Link>
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
        修正稿の再提出
      </h1>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>事務局からの差し戻し理由</h2>
        <div style={{ background: 'rgba(239,68,68,0.05)', borderLeft: '3px solid #f87171', padding: '1rem', borderRadius: '0 8px 8px 0', fontSize: '0.9375rem', color: '#fca5a5', whiteSpace: 'pre-wrap' }}>
          {latestSubmission?.office_feedback || '（差し戻し理由が記載されていません）'}
        </div>
      </div>

      <form action={`/api/my/papers/${paper.id}/submit`} method="POST" encType="multipart/form-data" className="card" style={{ padding: '2rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="file">
            修正版PDFファイル <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ border: '2px dashed var(--color-border)', borderRadius: 12, padding: '2rem', textAlign: 'center', background: 'var(--color-input)' }}>
            <input 
              type="file" 
              id="file" 
              name="file" 
              accept=".pdf" 
              required
              style={{ display: 'none' }}
            />
            <label htmlFor="file" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
              ファイルを選択
            </label>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              10MB以下のPDFファイル
            </p>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '2rem' }}>
          <label className="form-label" htmlFor="note">
            事務局へのメッセージ（任意）
          </label>
          <textarea 
            id="note" 
            name="note" 
            className="form-input" 
            rows={4} 
            placeholder="修正箇所や申し送り事項があればご記入ください"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Link href={`/my/papers/${paper.id}`} className="btn btn-secondary">
            キャンセル
          </Link>
          <button type="submit" className="btn btn-primary" onClick={() => alert('デモモード: この操作はモックAPIに送信され、状態が resubmitted に更新されます。')}>
            修正稿を提出する
          </button>
        </div>
      </form>
    </div>
  )
}
