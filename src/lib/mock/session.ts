/**
 * デモ用セッション管理
 * Cookie に demo_user_id を保存してログイン状態を管理する
 * Supabase Auth は使用しない
 */

import { cookies } from 'next/headers'
import { getProfile } from './store'
import type { Profile } from '@/types'

export const DEMO_COOKIE = 'demo_user_id'

// デフォルトログインユーザーID（presenterとして動作）
export const DEFAULT_USER_ID = 'user-presenter-1'

export async function getDemoUser(): Promise<Profile | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get(DEMO_COOKIE)?.value ?? DEFAULT_USER_ID
  return getProfile(userId)
}

export async function getDemoUserId(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get(DEMO_COOKIE)?.value ?? DEFAULT_USER_ID
}
