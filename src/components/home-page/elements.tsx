import React from 'react'

export const PageMain = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <main style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
    {/* Teal orb — top right */}
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '-120px',
        right: '-120px',
        zIndex: 0,
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        pointerEvents: 'none',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 5%, transparent) 0%, transparent 68%)',
      }}
    />
    {/* Navy orb — bottom left */}
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: '-80px',
        left: '-80px',
        zIndex: 0,
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,80,180,0.05) 0%, transparent 70%)',
      }}
    />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="px-[10px] py-[25px] sm:px-[50px] sm:py-[50px]">
        <div className="mx-auto w-full max-w-[1200px]">{children}</div>
      </div>
    </div>
  </main>
)

export const HeroSection = (): React.ReactNode => (
  <div className="mb-6 sm:mb-12" style={{ textAlign: 'center' }}>
    {/* Eyebrow tag */}
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        padding: '5px 16px',
        borderRadius: '999px',
        marginBottom: '30px',
        background: 'var(--accent-07)',
        border: '1px solid var(--accent-16)',
      }}
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
      <span
        style={{
          fontFamily: 'var(--font)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
        }}
      >
        Belief Exploration
      </span>
    </div>

    <h1
      style={{
        fontFamily: 'var(--font)',
        fontWeight: 700,
        letterSpacing: '-0.025em',
        fontSize: 'clamp(44px, 4.8vw, 72px)',
        color: 'var(--text)',
        lineHeight: 1.05,
        marginBottom: '20px',
      }}
    >
      StreetLogic <span style={{ color: 'var(--accent)' }}>AI</span>
    </h1>

    <p
      style={{
        fontFamily: 'var(--font)',
        fontSize: '14px',
        fontWeight: 400,
        color: 'var(--text-muted)',
        maxWidth: '360px',
        margin: '0 auto',
        lineHeight: 1.72,
      }}
    >
      Explore your confidence in what you believe — through conversation.
    </p>
  </div>
)

export const HeroDivider = (): React.ReactNode => (
  <div
    className="mx-auto mb-4 sm:mb-7"
    style={{ width: '40px', height: '1px', background: 'var(--accent)', opacity: 0.35 }}
  />
)

export const PrivacyNote = (): React.ReactNode => (
  <p
    style={{
      marginTop: '36px',
      fontSize: '11px',
      color: 'var(--text-muted)',
      textAlign: 'center',
      maxWidth: '420px',
      margin: '36px auto 0',
      lineHeight: 1.65,
      fontFamily: 'var(--font)',
    }}
  >
    We do not use your interactions to train AI models. Conversations are stored for 24–48 hours then permanently
    deleted.
  </p>
)
