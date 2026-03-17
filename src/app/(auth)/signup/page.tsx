'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '../actions'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          Research <span>Session</span> Hub
        </div>

        <div className="card">
          <h1 className="auth-title">新規登録</h1>
          <p className="auth-subtitle">アカウントを作成してください</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form action={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="display_name">
                表示名 <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                className="form-input"
                placeholder="山田 太郎"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="affiliation">
                所属
              </label>
              <input
                id="affiliation"
                name="affiliation"
                type="text"
                className="form-input"
                placeholder="○○大学 情報学部"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                メールアドレス <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="example@example.com"
                required
                autoComplete="email"
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
                placeholder="8文字以上"
                required
                autoComplete="new-password"
                minLength={8}
              />
              <span className="form-hint">8文字以上で設定してください</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? <span className="spinner" /> : 'アカウントを作成'}
            </button>
          </form>

          <div className="auth-footer">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login">ログイン</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
