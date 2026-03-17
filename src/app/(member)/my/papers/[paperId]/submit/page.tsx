'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'

const MAX_FILE_SIZE_MB = 20
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

interface Props {
  params: Promise<{ paperId: string }>
}

export default function SubmitPage({ params }: Props) {
  const { paperId } = use(params)
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (selected.type !== 'application/pdf') {
      setError('PDFファイルのみアップロードできます')
      e.target.value = ''
      return
    }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setError(`ファイルサイズは ${MAX_FILE_SIZE_MB}MB 以内にしてください`)
      e.target.value = ''
      return
    }
    setError(null)
    setFile(selected)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      setError('PDFファイルを選択してください')
      return
    }
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('submission_note', note)

    const res = await fetch(`/api/my/papers/${paperId}/submit`, {
      method: 'POST',
      body: formData,
    })

    const json = await res.json()

    if (!res.ok || json.error) {
      setError(json.error?.message ?? '提出に失敗しました')
      setLoading(false)
      return
    }

    router.push('/my/papers')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">原稿を提出する</h1>
        <p className="page-subtitle">PDFファイルをアップロードして初回提出を行ってください</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="file">
              原稿PDF <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              className="form-input"
              onChange={handleFileChange}
              required
              style={{ padding: '0.625rem 1rem' }}
            />
            <span className="form-hint">PDFファイル・最大 {MAX_FILE_SIZE_MB}MB まで</span>
          </div>

          {file && (
            <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
              📄 {file.name}（{(file.size / 1024 / 1024).toFixed(2)} MB）
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="note">
              提出メモ（任意）
            </label>
            <textarea
              id="note"
              className="form-textarea"
              placeholder="事務局への補足事項があれば入力してください"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              style={{ minHeight: 80 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading || !file}>
              {loading ? <span className="spinner" /> : '提出する'}
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
