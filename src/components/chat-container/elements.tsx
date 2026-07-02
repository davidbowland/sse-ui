import { Button, ListBoxItem, Select, SelectIndicator, SelectPopover, SelectTrigger, SelectValue } from '@heroui/react'
import { MessageSquarePlus } from 'lucide-react'
import React from 'react'
import { ListBox } from 'react-aria-components'

import { ConfidenceLevel } from '@types'

export const NavBar = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <nav
    className="sticky top-0 z-50 w-full"
    style={{
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
    }}
  >
    <div className="mx-auto w-full max-w-[1200px] px-[10px] sm:px-[28px]">{children}</div>
  </nav>
)

export const BrandSection = ({
  children,
  isHidden,
}: {
  children: React.ReactNode
  isHidden?: boolean
}): React.ReactNode => (
  <div
    className={`flex flex-col justify-center col-span-12 sm:col-span-6 lg:col-span-2 ${isHidden ? 'hidden lg:flex' : 'flex'}`}
  >
    {children}
  </div>
)

export const BrandTitle = (): React.ReactNode => (
  <div className="flex items-center justify-center gap-2">
    <span
      style={{
        fontFamily: 'var(--font)',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        color: 'var(--text)',
      }}
    >
      StreetLogic <span style={{ color: 'var(--accent-text)' }}>AI</span>
    </span>
  </div>
)

export const ConfidenceSection = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="order-3 col-span-12 lg:order-2 lg:col-span-8 lg:relative flex flex-col items-center justify-center">
    <p
      className="lg:absolute lg:bottom-full lg:left-0 lg:right-0"
      style={{
        marginBottom: '4px',
        textAlign: 'center',
        fontFamily: 'var(--font)',
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--accent-text)',
      }}
    >
      Your current stance
    </p>
    {children}
  </div>
)

export const NewClaimSection = ({
  children,
  isHidden,
}: {
  children: React.ReactNode
  isHidden?: boolean
}): React.ReactNode => (
  <div
    className={`order-2 col-span-12 sm:col-span-6 sm:pr-2 lg:order-3 lg:col-span-2 ${isHidden ? 'hidden lg:flex' : 'flex'} flex-col justify-center`}
  >
    {children}
  </div>
)

export const NewClaimButton = ({ onPress }: { onPress: () => void }): React.ReactNode => (
  <Button
    className="mx-auto w-full max-w-[250px]"
    onPress={onPress}
    style={{
      background: 'var(--accent-07)',
      border: '1px solid var(--accent-14)',
      color: 'var(--accent-text)',
      fontWeight: 600,
      borderRadius: '10px',
      fontFamily: 'var(--font)',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}
  >
    <MessageSquarePlus aria-hidden="true" size={14} />
    New claim
  </Button>
)

export const ConfidenceSelect = ({
  confidenceLevels,
  onChange,
  value,
}: {
  confidenceLevels: ConfidenceLevel[]
  onChange: (value: string) => void
  value: string | undefined
}): React.ReactNode => (
  <Select
    aria-label="Confidence"
    className="w-full"
    onSelectionChange={(key) => onChange(String(key))}
    selectedKey={value}
  >
    <SelectTrigger>
      <SelectValue />
      <SelectIndicator />
    </SelectTrigger>
    <SelectPopover>
      <ListBox>
        {confidenceLevels.map((level) => (
          <ListBoxItem id={level.value} key={level.value}>
            {level.label}
          </ListBoxItem>
        ))}
      </ListBox>
    </SelectPopover>
  </Select>
)

/**
 * Compact claim strip — always occupies height: 36px to prevent layout-shift jitter.
 * Visibility is controlled via opacity only; height never changes.
 */
export const CompactClaimStrip = ({
  claim,
  isVisible,
  'data-testid': dataTestId,
}: {
  claim: string | undefined
  isVisible: boolean
  'data-testid'?: string
}): React.ReactNode => (
  <div
    aria-hidden={!isVisible}
    data-testid={dataTestId}
    style={{
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '10px',
      paddingRight: '10px',
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      borderTop: `1px solid ${isVisible ? 'var(--accent-07)' : 'transparent'}`,
      transition: 'opacity 0.22s ease, border-top-color 0.22s ease',
    }}
  >
    <div
      style={{
        width: '2px',
        height: '16px',
        borderRadius: '1px',
        background: 'var(--accent)',
        flexShrink: 0,
        marginRight: '10px',
      }}
    />
    <span
      style={{
        fontFamily: 'var(--font)',
        fontSize: '12px',
        fontStyle: 'italic',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
      title={isVisible ? claim : undefined}
    >
      {isVisible ? claim : null}
    </span>
  </div>
)
