import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPapers, getProfile } from '@/lib/mock/store'
import { getDemoUser } from '@/lib/mock/session'
import { StatusBadge } from '@/components/StatusBadge'

export default async function OfficeDashboard() {
  const currentUser = await getDemoUser()
  if (!currentUser || currentUser.role !== 'office') {
    notFound()
  }

  const papers = getAllPapers()
  
  // 更新日時の降順にソート
  const sortedPapers = [...papers].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
          事務局ダッシュボード
        </h1>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          全 {sortedPapers.length} 件の投稿
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>状態</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>タイトル</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>著者 (所属)</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>最終更新</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedPapers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    投稿された論文はありません。
                  </td>
                </tr>
              ) : (
                sortedPapers.map(paper => (
                  <tr key={paper.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={paper.status} />
                    </td>
                    <td style={{ padding: '1rem', maxWidth: 300 }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {paper.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {paper.category}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', maxWidth: 200 }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {paper.author_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {paper.affiliation}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      {new Date(paper.updated_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Link href={`/office/papers/${paper.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                        詳細確認
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
