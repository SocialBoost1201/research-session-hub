'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getProfile, createProfile, generateId } from '@/lib/mock/store'
import { DEMO_COOKIE } from '@/lib/mock/session'
import { mockProfiles } from '@/lib/mock/data'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'メールアドレスとパスワードを入力してください' }
  }

  // デモ用：メールアドレスで対応ユーザーを探す
  // demo用の固定アカウント
  const demoAccounts: Record<string, string> = {
    'office@demo.com':    'user-office-1',
    'presenter@demo.com': 'user-presenter-1',
    'presenter2@demo.com':'user-presenter-2',
    'viewer@demo.com':    'user-viewer-1',
  }

  const userId = demoAccounts[email.toLowerCase()]
  if (!userId || password.length < 1) {
    return { error: 'メールアドレスまたはパスワードが正しくありません' }
  }

  const profile = getProfile(userId)
  if (!profile) {
    return { error: 'ユーザー情報が見つかりません' }
  }

  const cookieStore = await cookies()
  cookieStore.set(DEMO_COOKIE, userId, { path: '/', httpOnly: true, sameSite: 'lax' })
  cookieStore.set('demo_user_role', profile.role, { path: '/', httpOnly: true, sameSite: 'lax' })

  redirect('/mypage')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('display_name') as string
  const affiliation = formData.get('affiliation') as string

  if (!email || !password || !displayName) {
    return { error: '必須項目を入力してください' }
  }
  if (password.length < 8) {
    return { error: 'パスワードは8文字以上で設定してください' }
  }

  // デモ用：新規ユーザーを作成してセッションに保存
  const newId = generateId()
  const newProfile = createProfile({
    id: newId,
    role: 'viewer',
    display_name: displayName.trim(),
    affiliation: affiliation?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  const cookieStore = await cookies()
  cookieStore.set(DEMO_COOKIE, newId, { path: '/', httpOnly: true, sameSite: 'lax' })
  cookieStore.set('demo_user_role', newProfile.role, { path: '/', httpOnly: true, sameSite: 'lax' })

  redirect('/mypage')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(DEMO_COOKIE)
  cookieStore.delete('demo_user_role')
  redirect('/login')
}
