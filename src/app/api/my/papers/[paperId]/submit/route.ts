import { NextRequest, NextResponse } from 'next/server'
import { getPaperById, createSubmission, updatePaper, getLatestVersionNo, generateId } from '@/lib/mock/store'
import { ERROR_CODES } from '@/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ paperId: string }> }
) {
  const { paperId } = await params
  const userId = request.cookies.get('demo_user_id')?.value

  if (!userId) {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.UNAUTHORIZED, message: '認証が必要です' } }, { status: 401 })
  }

  const paper = getPaperById(paperId)
  if (!paper) {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.NOT_FOUND, message: '論文が見つかりません' } }, { status: 404 })
  }
  if (paper.presenter_id !== userId) {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.OWNERSHIP_ERROR, message: 'この論文の提出権限がありません' } }, { status: 403 })
  }
  if (paper.status !== 'draft') {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.INVALID_STATE, message: '下書き状態の投稿のみ初回提出できます' } }, { status: 400 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const submissionNote = formData.get('submission_note') as string | null

  if (!file) {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'PDFファイルを選択してください' } }, { status: 400 })
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.FILE_TYPE_NOT_ALLOWED, message: 'PDFファイルのみアップロードできます' } }, { status: 400 })
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ data: null, error: { code: ERROR_CODES.FILE_TOO_LARGE, message: 'ファイルサイズは20MB以内にしてください' } }, { status: 400 })
  }

  const versionNo = getLatestVersionNo(paperId) + 1
  const submissionId = generateId()
  const filePath = `papers/${paperId}/v${versionNo}/${file.name}`

  const submission = createSubmission({
    id: submissionId,
    paper_id: paperId,
    version_no: versionNo,
    file_path: filePath,
    file_name: file.name,
    submitted_by: userId,
    submission_note: submissionNote?.trim() || null,
    office_feedback: null,
    status: 'pending',
    created_at: new Date().toISOString(),
  })

  updatePaper(paperId, {
    current_submission_id: submissionId,
    status: 'submitted',
  })

  return NextResponse.json({ data: { submission }, error: null }, { status: 201 })
}
