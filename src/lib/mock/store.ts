/**
 * モックデータストア
 * Supabase の代わりにインメモリで CRUD 操作を提供する
 * Vercel Edge でも動作するよう、グローバル変数でデータを保持する
 */

import type { Paper, Profile, Submission, Thread, Comment, Review, PaperStatus } from '@/types'
import {
  mockPapers,
  mockProfiles,
  mockSubmissions,
  mockThreads,
  mockComments,
  mockReviews,
} from './data'

// グローバルシングルトン（Vercel の関数インスタンス単位で保持）
declare global {
  // eslint-disable-next-line no-var
  var __mockStore: {
    papers: Paper[]
    profiles: Profile[]
    submissions: Submission[]
    threads: Thread[]
    comments: Comment[]
    reviews: Review[]
  } | undefined
}

function getStore() {
  if (!global.__mockStore) {
    global.__mockStore = {
      papers:      [...mockPapers],
      profiles:    [...mockProfiles],
      submissions: [...mockSubmissions],
      threads:     [...mockThreads],
      comments:    [...mockComments],
      reviews:     [...mockReviews],
    }
  }
  return global.__mockStore
}

// ============================================================
// Profiles
// ============================================================

export function getProfile(userId: string): Profile | null {
  return getStore().profiles.find(p => p.id === userId) ?? null
}

export function createProfile(profile: Profile): Profile {
  getStore().profiles.push(profile)
  return profile
}

// ============================================================
// Papers
// ============================================================

export function getAllPapers(): Paper[] {
  return getStore().papers
}

export function getPublishedPapers(): Paper[] {
  return getStore().papers.filter(p =>
    p.status === 'published_members_only' || p.status === 'free_public'
  )
}

export function getPapersByPresenter(presenterId: string): Paper[] {
  return getStore().papers
    .filter(p => p.presenter_id === presenterId)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
}

export function getPaperById(paperId: string): Paper | null {
  return getStore().papers.find(p => p.id === paperId) ?? null
}

export function createPaper(paper: Paper): Paper {
  getStore().papers.push(paper)
  return paper
}

export function updatePaper(paperId: string, updates: Partial<Paper>): Paper | null {
  const store = getStore()
  const idx = store.papers.findIndex(p => p.id === paperId)
  if (idx === -1) return null
  store.papers[idx] = { ...store.papers[idx], ...updates, updated_at: new Date().toISOString() }
  return store.papers[idx]
}

// ============================================================
// Submissions
// ============================================================

export function getSubmissionsByPaper(paperId: string): Submission[] {
  return getStore().submissions
    .filter(s => s.paper_id === paperId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getSubmissionById(submissionId: string): Submission | null {
  return getStore().submissions.find(s => s.id === submissionId) ?? null
}

export function getAllSubmissions(): Submission[] {
  return getStore().submissions
}

export function getLatestVersionNo(paperId: string): number {
  const subs = getStore().submissions.filter(s => s.paper_id === paperId)
  if (subs.length === 0) return 0
  return Math.max(...subs.map(s => s.version_no))
}

export function createSubmission(submission: Submission): Submission {
  getStore().submissions.push(submission)
  return submission
}

export function updateSubmission(submissionId: string, updates: Partial<Submission>): Submission | null {
  const store = getStore()
  const idx = store.submissions.findIndex(s => s.id === submissionId)
  if (idx === -1) return null
  store.submissions[idx] = { ...store.submissions[idx], ...updates }
  return store.submissions[idx]
}

// ============================================================
// Reviews
// ============================================================

export function getReviewsByPaper(paperId: string): Review[] {
  return getStore().reviews
    .filter(r => r.paper_id === paperId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function createReview(review: Review): Review {
  getStore().reviews.push(review)
  return review
}

// ============================================================
// Threads
// ============================================================

export function getThreadByPaper(paperId: string): Thread | null {
  return getStore().threads.find(t => t.paper_id === paperId) ?? null
}

export function createThread(thread: Thread): Thread {
  getStore().threads.push(thread)
  return thread
}

export function updateThread(threadId: string, updates: Partial<Thread>): Thread | null {
  const store = getStore()
  const idx = store.threads.findIndex(t => t.id === threadId)
  if (idx === -1) return null
  store.threads[idx] = { ...store.threads[idx], ...updates }
  return store.threads[idx]
}

// ============================================================
// Comments
// ============================================================

export function getCommentsByThread(threadId: string): Comment[] {
  return getStore().comments
    .filter(c => c.thread_id === threadId && !c.is_deleted)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export function createComment(comment: Comment): Comment {
  getStore().comments.push(comment)
  return comment
}

export function deleteComment(commentId: string): boolean {
  const store = getStore()
  const idx = store.comments.findIndex(c => c.id === commentId)
  if (idx === -1) return false
  store.comments[idx].is_deleted = true
  return true
}

// ============================================================
// ユーティリティ
// ============================================================

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function statusLabel(status: PaperStatus): string {
  const map: Record<PaperStatus, string> = {
    draft:                  '下書き',
    submitted:              '提出済み',
    revision_requested:     '要修正',
    resubmitted:            '再提出済み',
    scheduled:              '公開待ち',
    published_members_only: '会員限定公開中',
    free_public:            '一般公開中',
    archived:               'アーカイブ',
  }
  return map[status] ?? status
}
