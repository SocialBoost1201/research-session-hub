import type { Submission } from '@/types'

export function SubmissionHistory({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          提出履歴はありません。
        </p>
      </div>
    )
  }

  // 降順にソート (新しいバージョンが上)
  const sorted = [...submissions].sort((a, b) => b.version_no - a.version_no)

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>📄</span> 提出履歴
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sorted.map(sub => (
          <div key={sub.id} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ 
                  background: 'rgba(99,102,241,0.1)', 
                  color: 'var(--color-primary)', 
                  fontWeight: 700, 
                  padding: '4px 8px', 
                  borderRadius: 6,
                  fontSize: '0.875rem'
                }}>
                  v{sub.version_no}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  {new Date(sub.created_at).toLocaleString('ja-JP')}
                </span>
              </div>
              <div>
                {sub.status === 'approved' && <span style={{ color: '#4ade80', fontSize: '0.875rem', fontWeight: 600 }}>受付済</span>}
                {sub.status === 'rejected' && <span style={{ color: '#f87171', fontSize: '0.875rem', fontWeight: 600 }}>差し戻し</span>}
                {sub.status === 'pending' && <span style={{ color: '#fbbf24', fontSize: '0.875rem', fontWeight: 600 }}>確認待ち</span>}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>提出ファイル:</div>
              <button 
                onClick={() => alert('デモモード: PDFのダウンロード処理（今回はモック動作）')}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  color: 'var(--color-primary)', textDecoration: 'underline',
                  cursor: 'pointer', fontSize: '0.9375rem', textAlign: 'left',
                }}
              >
                {sub.file_name}
              </button>
            </div>

            {sub.submission_note && (
              <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 8 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>発表者からのメッセージ:</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                  {sub.submission_note}
                </div>
              </div>
            )}

            {sub.office_feedback && (
              <div style={{ background: 'rgba(239,68,68,0.05)', borderLeft: '3px solid #f87171', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700, marginBottom: '0.25rem' }}>事務局からの差し戻し理由:</div>
                <div style={{ fontSize: '0.875rem', color: '#fca5a5', whiteSpace: 'pre-wrap' }}>
                  {sub.office_feedback}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
