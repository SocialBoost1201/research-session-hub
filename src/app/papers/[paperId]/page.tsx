import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPaperById, getThreadByPaper, getCommentsByThread, getProfile } from '@/lib/mock/store'
import { getDemoUser } from '@/lib/mock/session'
import { CommentThread } from '@/components/CommentThread'
import { StatusBadge } from '@/components/StatusBadge'

export default async function PublicPaperPage({
  params,
}: {
  params: Promise<{ paperId: string }>
}) {
  const { paperId } = await params
  const currentUser = await getDemoUser()

  const paper = getPaperById(paperId)
  if (!paper) {
    notFound()
  }

  // 閲覧権限チェック（デモ用）
  // published_members_only: ログインユーザーのみ
  // free_public: 誰でも
  // archived: 誰でも (設定次第だが今回は誰でもとする)
  const isPublicLevel = ['published_members_only', 'free_public', 'archived'].includes(paper.status)
  if (!isPublicLevel) {
    notFound() // 本来は 403 Forbidden にするが今回は 404
  }
  if (paper.status === 'published_members_only' && !currentUser) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 400 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>会員限定の論文です</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            この論文を閲覧するにはログインが必要です。
          </p>
          <Link href="/login" className="btn btn-primary" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
            ログイン画面へ
          </Link>
        </div>
      </main>
    )
  }

  const thread = getThreadByPaper(paper.id)
  const comments = thread ? getCommentsByThread(thread.id).map(c => ({
    ...c,
    author: getProfile(c.user_id),
  })) : []

  // discussion_end_atが過去ならクローズ扱いとする(デモなので単純判定)
  const isClosed = !!(thread?.status === 'closed' || (paper.discussion_end_at && new Date(paper.discussion_end_at) < new Date()))

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '4rem' }}>
      {/* 簡易ヘッダー */}
      <header style={{ 
        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky', top: 0, zIndex: 100 
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/papers" style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.02em', color: '#fff' }}>
            Research Session Hub
          </Link>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/papers" className="nav-item">一覧に戻る</Link>
            {currentUser ? (
              <Link href="/mypage" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  background: 'var(--color-primary)', color: '#fff', fontSize: '0.75rem',
                  padding: '2px 8px', borderRadius: 999 
                }}>
                  {currentUser.role}
                </span>
                マイページ
              </Link>
            ) : (
              <Link href="/login" className="btn btn-primary btn-sm">ログイン</Link>
            )}
          </nav>
        </div>
      </header>

      <div className="container" style={{ marginTop: '3rem', maxWidth: 900 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <StatusBadge status={paper.status} />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              カテゴリ: {paper.category}
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.4, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            {paper.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              👤
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{paper.author_name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🏢
              {paper.affiliation}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🕒
              最終更新: {new Date(paper.updated_at).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-text)' }}>
            アブストラクト
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>
            {paper.abstract}
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              論文ファイル
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              登録されている最新の原稿ファイルです。
            </p>
          </div>
          <button onClick={() => alert('デモモード: 最新版PDFの表示処理')} className="btn btn-secondary">
            PDFを表示
          </button>
        </div>

        {/* コメントスレッド表示 */}
        {thread && (
          <CommentThread
            threadId={thread.id}
            comments={comments}
            paperId={paper.id}
            currentUser={currentUser}
            isClosed={isClosed}
          />
        )}
      </div>
    </main>
  )
}
