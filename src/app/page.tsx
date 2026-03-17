import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', overflow: 'hidden' }}>

      {/* ナビ */}
      <header className="header">
        <div className="header-inner">
          <span className="header-logo">
            Research <span>Session</span> Hub
          </span>
          <nav className="header-nav">
            <Link href="/papers">論文一覧</Link>
          </nav>
          <div className="header-right">
            <Link href="/login" className="btn btn-secondary btn-sm">ログイン</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">新規登録</Link>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '3rem',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '5rem 2rem 4rem',
      }}>
        {/* テキスト */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 999,
            padding: '4px 14px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#a5b4fc',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Research Platform MVP
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: '#e2e8f0',
            marginBottom: '1.25rem',
          }}>
            研究発表を、<br />
            <span style={{ color: '#6366f1' }}>もっとスマートに。</span>
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            color: '#94a3b8',
            lineHeight: 1.75,
            marginBottom: '2rem',
            maxWidth: 440,
          }}>
            投稿・査読・差し戻し・公開・議論まで、研究発表のフロー全体を一元管理するプラットフォームです。
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/login" className="btn btn-primary btn-lg">
              今すぐ始める
            </Link>
            <Link href="/papers" className="btn btn-secondary btn-lg">
              論文一覧を見る
            </Link>
          </div>

          {/* 特徴タグ */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['投稿・提出管理', '差し戻し・再提出', '会員限定公開', 'コメント議論'].map(tag => (
              <span key={tag} style={{
                fontSize: '0.75rem',
                color: '#64748b',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                padding: '4px 10px',
              }}>
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ヒーロー画像 */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: -20,
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <Image
            src="/hero.png"
            alt="研究ナレッジネットワークの可視化"
            width={600}
            height={600}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 20,
              position: 'relative',
              zIndex: 1,
              filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.3))',
            }}
            priority
          />
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#e2e8f0',
          letterSpacing: '-0.02em',
        }}>
          研究発表の全フローを網羅
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '📄', title: '投稿・提出', desc: 'PDF原稿のアップロードとバージョン管理に対応' },
            { icon: '🔍', title: '審査・差し戻し', desc: '事務局が差し戻しコメントを付けて再提出を促せる' },
            { icon: '🔒', title: '会員限定公開', desc: 'ロールに応じたアクセス制御で段階的に公開' },
            { icon: '💬', title: 'コメント議論', desc: '論文ごとのスレッドで発表者と読者が議論できる' },
          ].map(item => (
            <div key={item.title} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '1.75rem',
              transition: 'border-color 0.15s, transform 0.15s',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#e2e8f0' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem',
        textAlign: 'center',
        color: '#475569',
        fontSize: '0.8125rem',
      }}>
        Research Session Hub — Demo Version
      </footer>
    </div>
  )
}
