import type { PaperStatus } from '@/types'

type BadgeStyle = {
  bg: string
  text: string
  border: string
  label: string
}

const STATUS_STYLES: Record<PaperStatus, BadgeStyle> = {
  draft: {
    bg: 'rgba(148,163,184,0.1)',
    text: '#94a3b8',
    border: 'rgba(148,163,184,0.2)',
    label: '下書き',
  },
  submitted: {
    bg: 'rgba(56,189,248,0.1)',
    text: '#38bdf8',
    border: 'rgba(56,189,248,0.2)',
    label: '提出済み（事務局確認中）',
  },
  revision_requested: {
    bg: 'rgba(239,68,68,0.1)',
    text: '#f87171',
    border: 'rgba(239,68,68,0.2)',
    label: '要修正（差し戻し）',
  },
  resubmitted: {
    bg: 'rgba(129,140,248,0.1)',
    text: '#818cf8',
    border: 'rgba(129,140,248,0.2)',
    label: '再提出済み',
  },
  scheduled: {
    bg: 'rgba(45,212,191,0.1)',
    text: '#2dd4bf',
    border: 'rgba(45,212,191,0.2)',
    label: '公開待ち',
  },
  published_members_only: {
    bg: 'rgba(99,102,241,0.15)',
    text: '#a5b4fc',
    border: 'rgba(99,102,241,0.3)',
    label: '会員限定公開中',
  },
  free_public: {
    bg: 'rgba(34,197,94,0.1)',
    text: '#4ade80',
    border: 'rgba(34,197,94,0.2)',
    label: '一般公開中',
  },
  archived: {
    bg: 'rgba(71,85,105,0.2)',
    text: '#cbd5e1',
    border: 'rgba(71,85,105,0.4)',
    label: 'アーカイブ（議論終了）',
  },
}

export function StatusBadge({ status, className = '' }: { status: PaperStatus, className?: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.625rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: '9999px',
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {style.label}
    </span>
  )
}
