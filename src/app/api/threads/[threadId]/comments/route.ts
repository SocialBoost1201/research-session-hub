import { NextResponse } from 'next/server'
import { getDemoUser } from '@/lib/mock/session'
import { createComment, getThreadByPaper, createThread, generateId } from '@/lib/mock/store'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const user = await getDemoUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { threadId } = await params
    const { body, paperId } = await request.json()

    if (!body || !paperId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // デモ用: もしthreadIdがモックになければ（新規作成時など）、スレッドを作ってしまう
    let thread = getThreadByPaper(paperId)
    if (!thread) {
      thread = createThread({
        id: threadId,
        paper_id: paperId,
        status: 'open',
        opened_at: new Date().toISOString(),
        closed_at: null,
        visibility: 'members_only',
        created_at: new Date().toISOString(),
      })
    }

    const newComment = createComment({
      id: generateId(),
      thread_id: thread.id,
      paper_id: paperId,
      user_id: user.id,
      parent_comment_id: null,
      body,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json(newComment)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
