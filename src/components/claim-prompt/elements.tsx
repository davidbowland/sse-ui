import { Button } from '@heroui/react'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'

// ─── Premium loader ──────────────────────────────────────────

export const PremiumLoader = (): React.ReactNode => (
  <div
    aria-label="Loading"
    role="status"
    style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}
  >
    {/* Ambient glow */}
    <div
      style={{
        position: 'absolute',
        inset: '-20px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 65%)',
        animation: 'loader-glow 2.8s ease-in-out infinite',
        pointerEvents: 'none',
      }}
    />
    {/* Conic gradient ring (comet trail) */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background:
          'conic-gradient(from 0deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 50%, transparent) 22%, color-mix(in srgb, var(--accent) 15%, transparent) 55%, transparent 72%, transparent 100%)',
        WebkitMask: 'radial-gradient(circle at center, transparent 40%, black 41%)',
        mask: 'radial-gradient(circle at center, transparent 40%, black 41%)',
        animation: 'loader-spin 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    />
    {/* Orbiting head dot */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        animation: 'loader-spin 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 10px 4px color-mix(in srgb, var(--accent) 55%, transparent)',
        }}
      />
    </div>
    <span className="sr-only">Loading…</span>
  </div>
)

// ─── Alert ───────────────────────────────────────────────────

export const ErrorAlert = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div
    className="mx-auto max-w-[600px]"
    style={{
      background: 'rgba(239,68,68,0.08)',
      border: '1px solid rgba(239,68,68,0.15)',
      borderRadius: '28px',
      padding: '7px',
    }}
  >
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: '23px',
        padding: '16px 20px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <p style={{ fontSize: '14px', color: 'var(--error)', fontFamily: 'var(--font)', lineHeight: 1.5 }}>{children}</p>
    </div>
  </div>
)

// ─── Claim card (confidence stage) ───────────────────────────

export const ClaimCard = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div
    className="mx-auto max-w-[800px]"
    style={{
      background: 'color-mix(in srgb, var(--accent) 2.5%, transparent)',
      border: '1px solid var(--border)',
      borderRadius: '28px',
      padding: '7px',
    }}
  >
    <div
      style={{
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, transparent) 0%, rgba(0,80,180,0.13) 100%)',
        borderRadius: '23px',
        padding: '18px 22px',
        textAlign: 'center',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {children}
    </div>
  </div>
)

export const ClaimCardLabel = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <p
    style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--accent-text)',
      marginBottom: '8px',
      fontFamily: 'var(--font)',
    }}
  >
    {children}
  </p>
)

// ─── Step indicator ──────────────────────────────────────────

const STEP_LABELS = ['Enter claim', 'Choose claim', 'Set confidence']

export const StepIndicator = React.forwardRef<HTMLElement, { currentStep: number }>(({ currentStep }, ref) => (
  <nav aria-label="Progress" className="flex w-full justify-center" ref={ref}>
    <ol className="flex items-center" style={{ listStyle: 'none', padding: 0 }}>
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1
        const isActive = stepNum === currentStep
        const isDone = stepNum < currentStep
        return (
          <React.Fragment key={stepNum}>
            {i > 0 && (
              <li
                aria-hidden="true"
                style={{
                  height: '1px',
                  width: '44px',
                  flexShrink: 0,
                  marginBottom: '22px',
                  background: isDone ? 'var(--accent)' : 'var(--border)',
                  opacity: isDone ? 0.5 : 1,
                }}
              />
            )}
            <li
              aria-current={isActive ? 'step' : undefined}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', width: '88px' }}
            >
              <span
                style={{
                  display: 'flex',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'var(--font)',
                  transition: 'transform 0.16s cubic-bezier(0.32,0.72,0,1)',
                  ...(isActive
                    ? {
                        background: 'var(--accent)',
                        color: 'var(--bg)',
                        boxShadow: '0 0 0 3px var(--accent-dim)',
                      }
                    : isDone
                      ? { background: 'var(--accent)', color: 'var(--bg)' }
                      : {
                          background: 'var(--accent-dim)',
                          border: '1px solid var(--accent-14)',
                          color: 'var(--text-muted)',
                        }),
                }}
              >
                {isDone ? '✓' : stepNum}
              </span>
              <span
                className="hidden text-center sm:block"
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font)',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--text)' : 'var(--text-muted)',
                }}
              >
                {label}
              </span>
            </li>
          </React.Fragment>
        )
      })}
    </ol>
  </nav>
))
StepIndicator.displayName = 'StepIndicator'

// ─── Selection list ──────────────────────────────────────────

export const SelectionList = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <ul
    className="mx-auto max-w-[800px]"
    style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}
  >
    {children}
  </ul>
)

export const SelectionListItem = ({
  children,
  isSelected,
  onClick,
}: {
  children: React.ReactNode
  isSelected: boolean
  onClick: () => void
}): React.ReactNode => (
  <li>
    <button
      aria-pressed={isSelected}
      className="flex w-full items-center gap-3 text-left text-sm"
      onClick={onClick}
      style={{
        borderRadius: '10px',
        padding: '13px 16px',
        cursor: 'pointer',
        fontFamily: 'var(--font)',
        fontSize: '14px',
        color: 'var(--text)',
        background: isSelected ? 'var(--accent-dim)' : 'transparent',
        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
        transition: 'all 0.16s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      <span
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          flexShrink: 0,
          background: isSelected ? 'var(--accent)' : 'transparent',
          border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--text-muted)'}`,
          transition: 'all 0.16s cubic-bezier(0.32,0.72,0,1)',
        }}
      />
      <span className="flex-1">{children}</span>
    </button>
  </li>
)

// ─── Buttons ─────────────────────────────────────────────────

export const PrimaryButton = ({
  children,
  disabled,
  onPress,
}: {
  children: React.ReactNode
  disabled?: boolean
  onPress: () => void
}): React.ReactNode => (
  <Button
    className="w-full"
    isDisabled={disabled}
    onPress={onPress}
    style={{
      background: disabled ? 'var(--accent-dim)' : 'var(--accent)',
      color: 'var(--bg)',
      fontWeight: 700,
      borderRadius: '12px',
      fontFamily: 'var(--font)',
      border: 'none',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '9px',
      padding: '12px 16px',
      transition: 'transform 0.12s cubic-bezier(0.32,0.72,0,1)',
      opacity: disabled ? 0.6 : 1,
    }}
  >
    <span>{children}</span>
    <span
      aria-hidden="true"
      style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        flexShrink: 0,
        background: 'rgba(4,10,18,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ArrowUpRight size={15} strokeWidth={2.5} />
    </span>
  </Button>
)

export const SecondaryButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode
  onPress: () => void
}): React.ReactNode => (
  <Button
    className="w-full"
    onPress={onPress}
    style={{
      background: 'transparent',
      border: '1px solid var(--accent-16)',
      color: 'var(--accent-text)',
      fontWeight: 500,
      borderRadius: '12px',
      fontFamily: 'var(--font)',
      fontSize: '14px',
      transition: 'all 0.16s cubic-bezier(0.32,0.72,0,1)',
    }}
  >
    {children}
  </Button>
)
