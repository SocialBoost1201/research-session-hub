'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { login } from '../actions'

const DEMO_ACCOUNTS = [
  { label: '事務局', email: 'office@demo.com', desc: '差し戻し・公開管理が可能' },
  { label: '発表者A', email: 'presenter@demo.com', desc: '投稿・提出が可能' },
  { label: '発表者B', email: 'presenter2@demo.com', desc: '投稿・提出が可能' },
  { label: '閲覧者', email: 'viewer@demo.com', desc: '公開論文のみ閲覧' },
]

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--color-bg)',
    }}>
      {/* 左カラム：イラスト */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, #0d0f1e 0%, #131629 100%)',
        borderRight: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        {/* 背景グロー */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          <Image
            src="/login-illustration.png"
            alt="研究論文のデジタル管理イメージ"
            width={380}
            height={380}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 20,
              marginBottom: '2rem',
              filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.25))',
            }}
            priority
          />
          <h2 style={{
            fontSize: '1.375rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#e2e8f0',
            marginBottom: '0.75rem',
          }}>
            Research Session Hub
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.7 }}>
            研究発表の投稿から査読・公開・議論まで、<br />
            学術コミュニティを支えるプラットフォーム
          </p>
        </div>
      </div>

      {/* 右カラム：ログインフォーム */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        overflowY: 'auto',
        background: 'var(--color-bg)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
            color: 'var(--color-text)',
          }}>
            ログイン
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            アカウントにサインインしてください
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                メールアドレス <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="example@demo.com"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                パスワード <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="任意の文字列"
                required
                autoComplete="current-password"
              />
              <span className="form-hint">デモモードではパスワードはなんでも可</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? <span className="spinner" /> : 'ログイン'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            アカウントをお持ちでない方は{' '}
            <Link href="/signup">新規登録</Link>
          </p>

          {/* デモアカウント一覧 */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <p style={{
              fontSize: '0.6875rem',
              color: 'var(--color-text-muted)',
              marginBottom: '0.75rem',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
            }}>
              デモアカウント（クリックで自動入力）
            </p>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => setEmail(acc.email)}
                  style={{
                    background: email === acc.email ? 'rgba(99,102,241,0.12)' : 'var(--color-surface)',
                    border: `1px solid ${email === acc.email ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 8,
                    padding: '0.625rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{acc.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{acc.desc}</div>
                  </div>
                  <code style={{
                    fontSize: '0.6875rem',
                    color: 'var(--color-primary)',
                    background: 'rgba(99,102,241,0.1)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    whiteSpace: 'nowrap',
                    marginLeft: '0.5rem',
                  }}>
                    {acc.email}
                  </code>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
