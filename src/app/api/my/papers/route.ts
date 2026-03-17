import { NextRequest, NextResponse } from 'next/server'
import { getPapersByPresenter, createPaper, generateId } from '@/lib/mock/store'
import { ERROR_CODES } from '@/types'

// GET /api/my/papers
export async function GET(request: NextRequest) {
  const userId = request.cookies.get('demo_user_id')?.value
  if (!userId) {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.UNAUTHORIZED, message: '認証が必要です' } }, { status: 401 })
  }

  const papers = getPapersByPresenter(userId)
  return NextResponse.json({ data: papers, error: null })
}

// POST /api/my/papers
export async function POST(request: NextRequest) {
  const userId = request.cookies.get('demo_user_id')?.value
  const userRole = request.cookies.get('demo_user_role')?.value

  if (!userId) {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.UNAUTHORIZED, message: '認証が必要です' } }, { status: 401 })
  }
  if (userRole === 'viewer') {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.FORBIDDEN, message: '投稿の作成権限がありません' } }, { status: 403 })
  }

  const body = await request.json()
  const { title, abstract, category, author_name, affiliation } = body

  if (!title?.trim()) return NextResponse.json({ data: null, error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'タイトルは必須です' } }, { status: 400 })
  if (!abstract?.trim()) return NextResponse.json({ data: null, error: { code: ERROR_CODES.VALIDATION_ERROR, message: '概要は必須です' } }, { status: 400 })
  if (!category?.trim()) return NextResponse.json({ data: null, error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'カテゴリは必須です' } }, { status: 400 })
  if (!author_name?.trim()) return NextResponse.json({ data: null, error: { code: ERROR_CODES.VALIDATION_ERROR, message: '著者名は必須です' } }, { status: 400 })
  if (!affiliation?.trim()) return NextResponse.json({ data: null, error: { code: ERROR_CODES.VALIDATION_ERROR, message: '所属は必須です' } }, { status: 400 })

  const now = new Date().toISOString()
  const paper = createPaper({
    id: generateId(),
    title: title.trim(),
    abstract: abstract.trim(),
    category: category.trim(),
    author_name: author_name.trim(),
    affiliation: affiliation.trim(),
    presenter_id: userId,
    current_submission_id: null,
    visibility: 'private',
    status: 'draft',
    scheduled_publish_at: null,
    discussion_start_at: null,
    discussion_end_at: null,
    published_at: null,
    free_public_at: null,
    archived_at: null,
    created_at: now,
    updated_at: now,
  })

  return NextResponse.json({ data: paper, error: null }, { status: 201 })
}
