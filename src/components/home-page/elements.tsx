import { MessageCircle } from 'lucide-react'
import React from 'react'

export const PageMain = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <main style={{ minHeight: '90vh', backgroundColor: 'var(--color-bg)' }}>
    <div className="px-[10px] py-[25px] sm:px-[50px] sm:py-[50px]">
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </div>
  </main>
)

export const HeroSection = (): React.ReactNode => (
  <div className="flex flex-col items-center gap-3">
    <div className="flex items-center gap-3">
      <MessageCircle size={32} style={{ color: 'var(--color-brand)' }} />
      <h1
        className="font-semibold tracking-[0.15em]"
        style={{
          fontSize: 'clamp(36px, 5vw, 58px)',
          fontVariant: 'small-caps',
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
        }}
      >
        StreetLogic AI
      </h1>
    </div>
    <p
      className="max-w-[520px] text-lg font-light"
      style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-ui)' }}
    >
      Explore your confidence in what you believe — through conversation.
    </p>
  </div>
)

export const HeroDivider = (): React.ReactNode => (
  <div className="mx-auto w-16" style={{ height: '2px', backgroundColor: 'var(--color-brand)', opacity: 0.4 }} />
)

export const PrivacyNote = (): React.ReactNode => (
  <p
    className="mx-auto max-w-[640px] px-4 text-xs"
    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-ui)' }}
  >
    We do not use your interactions to train AI models. Conversations are stored for 24–48 hours then permanently
    deleted.
  </p>
)
