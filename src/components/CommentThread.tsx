'use client'

import { useState, useTransition } from 'react'
import type { Comment, Profile } from '@/types'
import { useRouter } from 'next/navigation'

export function CommentThread({ 
  threadId, 
  comments, 
  paperId, 
  currentUser,
  isClosed 
}: { 
  threadId: string
  comments: (Comment & { author: Profile | null })[]
  paperId: string
  currentUser: Profile | null
  isClosed: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    if (!currentUser) {
      alert('ログインが必要です')
      return
    }
    
    startTransition(async () => {
      try {
        const res = await fetch(`/api/threads/${threadId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: body.trim(), paperId }),
        })
        
        if (!res.ok) {
          throw new Error('コメント投稿に失敗しました')
        }
        
        setBody('')
        setError(null)
        router.refresh()
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>💬</span> 議論・コメント
        {isClosed && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: 4 }}>
            受付終了
          </span>
        )}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
            まだコメントはありません。
          </p>
        ) : (
          comments.map(c => (
            <div key={c.id} style={{ 
              display: 'flex', 
              gap: '1rem',
              background: c.user_id === currentUser?.id ? 'rgba(99,102,241,0.03)' : 'transparent',
              padding: '1rem',
              borderRadius: 12,
              border: c.user_id === currentUser?.id ? '1px solid rgba(99,102,241,0.1)' : '1px solid transparent'
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0,
              }}>
                {c.author?.role === 'office' ? '🏢' : '👤'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)' }}>
                    {c.author?.display_name || '不明なユーザー'}
                  </span>
                  {c.author?.role === 'office' && (
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-primary)', background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: 4 }}>事務局</span>
                  )}
                  {c.author?.role === 'presenter' && (
                    <span style={{ fontSize: '0.6875rem', color: '#818cf8', background: 'rgba(129,140,248,0.1)', padding: '2px 6px', borderRadius: 4 }}>発表者</span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {new Date(c.created_at).toLocaleString('ja-JP')}
                  </span>
                </div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {c.body}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 投稿フォーム */}
      {isClosed ? (
        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 12, textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            議論期間が終了したため、新規コメントの投稿はできません。
          </p>
        </div>
      ) : !currentUser ? (
        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 12, textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            コメントを投稿するにはログインが必要です。
          </p>
          <button onClick={() => router.push('/login')} className="btn btn-secondary btn-sm">
            ログイン画面へ
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 12, border: '1px solid rgba(99,102,241,0.2)' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem' }}>
            コメントを投稿する ({currentUser.display_name}として)
          </h4>
          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <textarea
              className="form-input"
              rows={4}
              placeholder="論文に関する意見や質問を入力してください..."
              value={body}
              onChange={e => setBody(e.target.value)}
              disabled={isPending}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isPending || !body.trim()}
            >
              {isPending ? '送信中...' : '投稿する'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
