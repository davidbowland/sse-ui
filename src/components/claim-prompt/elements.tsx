import { AlertContent, AlertDescription, AlertRoot, Button } from '@heroui/react'
import React from 'react'

// ─── Alert ───────────────────────────────────────────────────

export const ErrorAlert = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <AlertRoot className="mx-auto max-w-[600px]" status="danger">
    <AlertContent>
      <AlertDescription>{children}</AlertDescription>
    </AlertContent>
  </AlertRoot>
)

// ─── Claim card ──────────────────────────────────────────────

export const ClaimCard = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div
    className="mx-auto max-w-[800px] rounded-xl px-6 py-5 text-center text-white"
    style={{
      background: 'linear-gradient(135deg, var(--color-brand) 0%, #4a5de8 100%)',
      boxShadow: '0 4px 24px rgba(99, 115, 250, 0.3)',
    }}
  >
    {children}
  </div>
)

export const ClaimCardLabel = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
    {children}
  </p>
)

// ─── Step indicator (replaces breadcrumbs) ───────────────────

const STEP_LABELS = ['Enter claim', 'Choose claim', 'Set confidence']

export const StepIndicator = React.forwardRef<HTMLElement, { currentStep: number }>(({ currentStep }, ref) => (
  <nav aria-label="Progress" className="flex w-full justify-center" ref={ref}>
    <ol className="flex items-center gap-2 sm:gap-3">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1
        const isActive = stepNum === currentStep
        const isDone = stepNum < currentStep
        return (
          <React.Fragment key={stepNum}>
            {i > 0 && (
              <li
                aria-hidden="true"
                className="h-px w-6 flex-shrink-0 sm:w-10"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
            )}
            <li className="flex flex-col items-center gap-1.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200"
                style={
                  isActive
                    ? { backgroundColor: 'var(--color-brand)', color: '#fff' }
                    : isDone
                      ? { backgroundColor: 'var(--color-brand-dim)', color: 'var(--color-brand)' }
                      : {
                          backgroundColor: 'rgba(128,128,128,0.12)',
                          color: 'var(--color-text-muted)',
                        }
                }
              >
                {isDone ? '✓' : stepNum}
              </span>
              <span
                className="hidden text-xs sm:block"
                style={{
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  fontWeight: isActive ? '500' : '400',
                  fontFamily: 'var(--font-ui)',
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
  <ul className="mx-auto flex max-w-[800px] list-none flex-col gap-2 p-0">{children}</ul>
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
      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all duration-150"
      onClick={onClick}
      style={{
        backgroundColor: isSelected ? 'var(--color-brand-dim)' : 'transparent',
        border: `1.5px solid ${isSelected ? 'var(--color-brand)' : 'var(--color-border)'}`,
        color: 'var(--color-text)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <span
        className="h-3 w-3 flex-shrink-0 rounded-full transition-all duration-150"
        style={{
          backgroundColor: isSelected ? 'var(--color-brand)' : 'transparent',
          border: `2px solid ${isSelected ? 'var(--color-brand)' : 'var(--color-text-muted)'}`,
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
  <Button className="w-full" isDisabled={disabled} onPress={onPress} variant="primary">
    {children}
  </Button>
)

export const SecondaryButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode
  onPress: () => void
}): React.ReactNode => (
  <Button className="w-full" onPress={onPress} variant="outline">
    {children}
  </Button>
)
