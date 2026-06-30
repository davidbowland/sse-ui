import React from 'react'

export const PolicyPage = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', padding: '48px 24px 64px' }}>
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>{children}</div>
  </div>
)

export const PolicyEyebrow = (): React.ReactNode => (
  <p
    style={{
      fontFamily: 'var(--font)',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginBottom: '14px',
    }}
  >
    Legal
  </p>
)

export const PolicyTitle = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <h1
    style={{
      fontFamily: 'var(--font)',
      fontSize: 'clamp(32px, 5vw, 48px)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--text)',
      lineHeight: 1.1,
      marginBottom: '14px',
    }}
  >
    {children}
  </h1>
)

export const PolicyIntro = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <p
    style={{
      fontFamily: 'var(--font)',
      fontSize: '15px',
      color: 'var(--text)',
      lineHeight: 1.72,
      marginBottom: '40px',
    }}
  >
    {children}
  </p>
)

export const PolicySection = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div style={{ paddingBottom: '28px', marginBottom: '28px', borderBottom: '1px solid var(--border)' }}>{children}</div>
)

export const PolicySectionLabel = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <p
    style={{
      fontFamily: 'var(--font)',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginBottom: '8px',
    }}
  >
    {children}
  </p>
)

export const PolicySectionBody = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <p style={{ fontFamily: 'var(--font)', fontSize: '14px', color: 'var(--text)', lineHeight: 1.72 }}>{children}</p>
)

export const PolicyFooter = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '28px',
      flexWrap: 'wrap',
      gap: '8px',
    }}
  >
    {children}
  </div>
)
