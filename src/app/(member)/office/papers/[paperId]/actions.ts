'use server'

import { redirect } from 'next/navigation'
import { getDemoUser } from '@/lib/mock/session'
import { getPaperById, updatePaper, createReview, getSubmissionsByPaper, updateSubmission, createThread } from '@/lib/mock/store'
import { generateId } from '@/lib/mock/store'

export async function requestRevision(paperId: string, formData: FormData): Promise<void> {
  const user = await getDemoUser()
  if (!user || user.role !== 'office') throw new Error('Unauthorized')

  const paper = getPaperById(paperId)
  if (!paper) throw new Error('Paper not found')

  const feedback = formData.get('feedback') as string
  if (!feedback) throw new Error('フィードバックを入力してください')

  const subs = getSubmissionsByPaper(paperId)
  const currentSub = subs[0]

  if (currentSub) {
    updateSubmission(currentSub.id, { 
      status: 'rejected',
      office_feedback: feedback
    })
  }

  createReview({
    id: generateId(),
    paper_id: paperId,
    submission_id: currentSub?.id || '',
    reviewer_id: user.id,
    review_type: 'revision_request',
    decision: 'request_revision',
    comment: feedback,
    created_at: new Date().toISOString()
  })

  updatePaper(paperId, { status: 'revision_requested' })
  redirect(`/office/papers/${paperId}`)
}

export async function approveAndSchedule(paperId: string, formData?: FormData): Promise<void> {
  const user = await getDemoUser()
  if (!user || user.role !== 'office') throw new Error('Unauthorized')

  const paper = getPaperById(paperId)
  if (!paper) throw new Error('Paper not found')

  const subs = getSubmissionsByPaper(paperId)
  const currentSub = subs[0]
  if (currentSub) {
    updateSubmission(currentSub.id, { status: 'approved' })
  }

  // デモモードではとりあえず `scheduled` 状態にして、スレッドも作成しておく
  updatePaper(paperId, { status: 'scheduled' })
  createThread({
    id: generateId(),
    paper_id: paperId,
    status: 'open',
    opened_at: new Date().toISOString(),
    closed_at: null,
    visibility: 'members_only',
    created_at: new Date().toISOString()
  })
  
  redirect(`/office/papers/${paperId}`)
}

export async function publishPaper(paperId: string, visibility: 'members_only' | 'free_public', formData?: FormData): Promise<void> {
  const user = await getDemoUser()
  if (!user || user.role !== 'office') throw new Error('Unauthorized')

  const paper = getPaperById(paperId)
  if (!paper) throw new Error('Paper not found')

  updatePaper(paperId, { 
    status: visibility === 'free_public' ? 'free_public' : 'published_members_only',
    visibility
  })
  redirect(`/office/papers/${paperId}`)
}
