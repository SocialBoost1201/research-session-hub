'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  '情報科学',
  '人工知能・機械学習',
  'ネットワーク・セキュリティ',
  'ヒューマンコンピュータインタラクション',
  'データベース・データ工学',
  '計算理論・アルゴリズム',
  'コンピュータビジョン',
  '自然言語処理',
  'ソフトウェア工学',
  'その他',
]

export default function NewPaperPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const body = {
      title:       formData.get('title'),
      abstract:    formData.get('abstract'),
      category:    formData.get('category'),
      author_name: formData.get('author_name'),
      affiliation: formData.get('affiliation'),
    }

    const res = await fetch('/api/my/papers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const json = await res.json()

    if (!res.ok || json.error) {
      setError(json.error?.message ?? '投稿の作成に失敗しました')
      setLoading(false)
      return
    }

    router.push('/my/papers')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">新規投稿を作成</h1>
        <p className="page-subtitle">研究発表の基本情報を入力してください</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              タイトル <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              placeholder="研究発表のタイトルを入力"
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="abstract">
              概要 <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <textarea
              id="abstract"
              name="abstract"
              className="form-textarea"
              placeholder="研究の概要・目的・方法・結果などを入力してください"
              required
              maxLength={2000}
              style={{ minHeight: 160 }}
            />
            <span className="form-hint">最大 2000 文字</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">
              カテゴリ <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <select id="category" name="category" className="form-select" required>
              <option value="">カテゴリを選択してください</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="author_name">
              著者名 <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="author_name"
              name="author_name"
              type="text"
              className="form-input"
              placeholder="山田 太郎"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="affiliation">
              所属 <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="affiliation"
              name="affiliation"
              type="text"
              className="form-input"
              placeholder="○○大学 情報学部"
              required
              maxLength={200}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : '下書きとして保存'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.back()}
              disabled={loading}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
