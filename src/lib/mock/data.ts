import type { Profile, Paper, Submission, Thread, Comment, Review } from '@/types'

// ============================================================
// デモ用モックデータ
// メモリ上で状態を保持する（サーバー再起動でリセット）
// ============================================================

// --- プロフィール ---
export const mockProfiles: Profile[] = [
  {
    id: 'user-office-1',
    role: 'office',
    display_name: '事務局 太郎',
    affiliation: '学術研究推進センター',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-presenter-1',
    role: 'presenter',
    display_name: '山田 花子',
    affiliation: '東京大学 情報学環',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
  },
  {
    id: 'user-presenter-2',
    role: 'presenter',
    display_name: '佐藤 健一',
    affiliation: '京都大学 情報学研究科',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'user-viewer-1',
    role: 'viewer',
    display_name: '鈴木 一郎',
    affiliation: '大阪大学',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
]

// --- 論文 ---
export const mockPapers: Paper[] = [
  {
    id: 'paper-1',
    title: '深層学習を用いた医療画像診断の精度向上に関する研究',
    abstract: '本研究では、Transformer ベースのアーキテクチャを活用し、CT画像からの異常検知精度を従来手法比で15%向上させた。大規模な医療画像データセットを用いた実験により、提案手法の有効性を実証した。',
    category: '人工知能・機械学習',
    author_name: '山田 花子',
    affiliation: '東京大学 情報学環',
    presenter_id: 'user-presenter-1',
    current_submission_id: 'submission-1',
    visibility: 'members_only',
    status: 'published_members_only',
    scheduled_publish_at: null,
    discussion_start_at: '2024-06-01T00:00:00Z',
    discussion_end_at: '2024-08-31T23:59:59Z',
    published_at: '2024-06-01T00:00:00Z',
    free_public_at: null,
    archived_at: null,
    created_at: '2024-05-10T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'paper-2',
    title: '量子コンピューティングを活用した組合せ最適化問題の高速解法',
    abstract: '量子アニーリングを応用した新たなアルゴリズムを提案し、物流ルート最適化問題において古典的手法と比較して計算時間を大幅に短縮することに成功した。',
    category: '計算理論・アルゴリズム',
    author_name: '佐藤 健一',
    affiliation: '京都大学 情報学研究科',
    presenter_id: 'user-presenter-2',
    current_submission_id: 'submission-2',
    visibility: 'private',
    status: 'revision_requested',
    scheduled_publish_at: null,
    discussion_start_at: null,
    discussion_end_at: null,
    published_at: null,
    free_public_at: null,
    archived_at: null,
    created_at: '2024-05-15T00:00:00Z',
    updated_at: '2024-05-20T00:00:00Z',
  },
  {
    id: 'paper-3',
    title: 'プライバシー保護型連合学習の実装と評価',
    abstract: '差分プライバシーと連合学習を組み合わせた新しいフレームワークを実装し、個人情報を保護しながら高精度なモデル学習を実現した。',
    category: 'ネットワーク・セキュリティ',
    author_name: '山田 花子',
    affiliation: '東京大学 情報学環',
    presenter_id: 'user-presenter-1',
    current_submission_id: null,
    visibility: 'private',
    status: 'draft',
    scheduled_publish_at: null,
    discussion_start_at: null,
    discussion_end_at: null,
    published_at: null,
    free_public_at: null,
    archived_at: null,
    created_at: '2024-05-25T00:00:00Z',
    updated_at: '2024-05-25T00:00:00Z',
  },
  {
    id: 'paper-4',
    title: '自然言語処理を活用した特許文書の自動分類システム',
    abstract: 'BERTを特許ドメインに特化してファインチューニングした手法により、特許文書の国際特許分類（IPC）を高精度で自動付与することが可能となった。',
    category: '自然言語処理',
    author_name: '佐藤 健一',
    affiliation: '京都大学 情報学研究科',
    presenter_id: 'user-presenter-2',
    current_submission_id: 'submission-4',
    visibility: 'free_public',
    status: 'free_public',
    scheduled_publish_at: null,
    discussion_start_at: '2024-04-01T00:00:00Z',
    discussion_end_at: '2024-05-31T23:59:59Z',
    published_at: '2024-04-01T00:00:00Z',
    free_public_at: '2024-06-01T00:00:00Z',
    archived_at: null,
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  },
]

// --- 提出 ---
export const mockSubmissions: Submission[] = [
  {
    id: 'submission-1',
    paper_id: 'paper-1',
    version_no: 1,
    file_path: 'papers/paper-1/v1/manuscript.pdf',
    file_name: 'manuscript_v1.pdf',
    submitted_by: 'user-presenter-1',
    submission_note: '初回提出です。ご確認よろしくお願いします。',
    office_feedback: null,
    status: 'approved',
    created_at: '2024-05-11T09:00:00Z',
  },
  {
    id: 'submission-2',
    paper_id: 'paper-2',
    version_no: 1,
    file_path: 'papers/paper-2/v1/manuscript.pdf',
    file_name: 'quantum_paper_v1.pdf',
    submitted_by: 'user-presenter-2',
    submission_note: null,
    office_feedback: '図3の説明が不足しています。実験環境の詳細を追記してください。また参考文献の記載形式を統一してください。',
    status: 'rejected',
    created_at: '2024-05-16T10:30:00Z',
  },
  {
    id: 'submission-4',
    paper_id: 'paper-4',
    version_no: 2,
    file_path: 'papers/paper-4/v2/manuscript.pdf',
    file_name: 'patent_nlp_v2.pdf',
    submitted_by: 'user-presenter-2',
    submission_note: '指摘事項を修正しました。',
    office_feedback: null,
    status: 'approved',
    created_at: '2024-03-20T14:00:00Z',
  },
]

// --- レビュー ---
export const mockReviews: Review[] = [
  {
    id: 'review-1',
    paper_id: 'paper-2',
    submission_id: 'submission-2',
    reviewer_id: 'user-office-1',
    review_type: 'revision_request',
    decision: 'request_revision',
    comment: '図3の説明が不足しています。実験環境の詳細を追記してください。また参考文献の記載形式を統一してください。',
    created_at: '2024-05-20T11:00:00Z',
  },
]

// --- スレッド ---
export const mockThreads: Thread[] = [
  {
    id: 'thread-1',
    paper_id: 'paper-1',
    status: 'open',
    opened_at: '2024-06-01T00:00:00Z',
    closed_at: null,
    visibility: 'members_only',
    created_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'thread-4',
    paper_id: 'paper-4',
    status: 'closed',
    opened_at: '2024-04-01T00:00:00Z',
    closed_at: '2024-05-31T23:59:59Z',
    visibility: 'free_public',
    created_at: '2024-04-01T00:00:00Z',
  },
]

// --- コメント ---
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    thread_id: 'thread-1',
    paper_id: 'paper-1',
    user_id: 'user-viewer-1',
    parent_comment_id: null,
    body: '非常に興味深い研究です。提案手法のデータ拡張はどのように行いましたか？',
    is_deleted: false,
    created_at: '2024-06-05T10:00:00Z',
    updated_at: '2024-06-05T10:00:00Z',
  },
  {
    id: 'comment-2',
    thread_id: 'thread-1',
    paper_id: 'paper-1',
    user_id: 'user-presenter-1',
    parent_comment_id: 'comment-1',
    body: 'ご質問ありがとうございます。回転・フリップ・明度変換を組み合わせたオーグメンテーションを使用しています。詳細は論文の3.2節をご参照ください。',
    is_deleted: false,
    created_at: '2024-06-05T14:30:00Z',
    updated_at: '2024-06-05T14:30:00Z',
  },
  {
    id: 'comment-3',
    thread_id: 'thread-1',
    paper_id: 'paper-1',
    user_id: 'user-office-1',
    parent_comment_id: null,
    body: '発表当日の質問は事前にこちらに投稿いただくと、著者への連絡がスムーズです。',
    is_deleted: false,
    created_at: '2024-06-03T09:00:00Z',
    updated_at: '2024-06-03T09:00:00Z',
  },
]

// ============================================================
// デモ用セッション管理（Cookie不使用のシンプルな実装）
// デモでは URL パラメータまたはデフォルトユーザーでログイン扱い
// ============================================================

export const DEMO_USERS = {
  office:    mockProfiles[0],
  presenter: mockProfiles[1],
  viewer:    mockProfiles[3],
} as const

export type DemoRole = keyof typeof DEMO_USERS

// デフォルトのデモユーザー（presenterとして動作）
export const DEFAULT_DEMO_USER = mockProfiles[1]
