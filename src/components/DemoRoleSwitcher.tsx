'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { switchDemoRole } from '@/app/(auth)/actions'

export function DemoRoleSwitcher() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const roles = [
    { id: 'office', email: 'office@demo.com', label: '事務局', desc: '確認・公開管理' },
    { id: 'presenter', email: 'presenter@demo.com', label: '発表者A', desc: '投稿・提出' },
    { id: 'presenter2', email: 'presenter2@demo.com', label: '発表者B', desc: '投稿・提出' },
    { id: 'viewer', email: 'viewer@demo.com', label: '閲覧者', desc: '公開論文のみ' },
  ]

  async function handleSwitch(email: string) {
    if (isPending) return
    startTransition(async () => {
      const res = await switchDemoRole(email)
      if (res?.error) {
        alert(res.error)
      } else {
        setIsOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: '1rem',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: '1rem',
          width: 280,
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Switch Role (Demo Mode)
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => handleSwitch(role.email)}
                disabled={isPending}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '0.625rem',
                  borderRadius: 8,
                  cursor: isPending ? 'wait' : 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s',
                  columnGap: '1rem',
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{role.label}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{role.desc}</div>
                </div>
                <div style={{ fontSize: '1rem' }}>→</div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'transform 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        🔄
      </button>
    </div>
  )
}
