import { redirect } from 'next/navigation'
import { getDemoUser } from '@/lib/mock/session'
import { getPapersByPresenter } from '@/lib/mock/store'
import { statusLabel } from '@/lib/mock/store'
import Link from 'next/link'
import type { Paper } from '@/types'

export default async function MyPapersPage() {
  const profile = await getDemoUser()
  if (!profile) redirect('/login')

  if (profile.role === 'viewer') {
    redirect('/mypage')
  }

  const papers = getPapersByPresenter(profile.id)

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">マイ投稿</h1>
          <p className="page-subtitle">あなたの研究発表投稿一覧</p>
        </div>
        <Link href="/my/papers/new" className="btn btn-primary">
          + 新規投稿を作成
        </Link>
      </div>

      {papers.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">まだ投稿がありません</p>
          <p className="empty-state-desc">新規投稿を作成して研究発表を始めましょう</p>
          <Link href="/my/papers/new" className="btn btn-primary">
            最初の投稿を作成
          </Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>タイトル</th>
                <th>カテゴリ</th>
                <th>状態</th>
                <th>最終更新</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper: Paper) => (
                <tr key={paper.id}>
                  <td>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{paper.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {paper.author_name} / {paper.affiliation}
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{paper.category}</td>
                  <td>
                    <span className={`badge badge-${paper.status}`}>
                      {statusLabel(paper.status)}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {new Date(paper.updated_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {paper.status === 'draft' && (
                        <Link href={`/my/papers/${paper.id}/submit`} className="btn btn-primary btn-sm">
                          提出する
                        </Link>
                      )}
                      {paper.status === 'revision_requested' && (
                        <Link href={`/my/papers/${paper.id}/resubmit`} className="btn btn-primary btn-sm">
                          再提出する
                        </Link>
                      )}
                      <Link href={`/my/papers/${paper.id}`} className="btn btn-secondary btn-sm">
                        詳細
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
