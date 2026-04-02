import { Button, ListBoxItem, Select, SelectIndicator, SelectPopover, SelectTrigger, SelectValue } from '@heroui/react'
import { MessageCircle, MessageSquarePlus } from 'lucide-react'
import React from 'react'
import { ListBox } from 'react-aria-components'

import { ConfidenceLevel } from '@types'

export const NavBar = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <nav
    className="px-4 py-3"
    style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
    }}
  >
    <div className="grid grid-cols-12 items-center gap-2 p-1 text-center">{children}</div>
  </nav>
)

export const BrandSection = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="col-span-12 flex flex-col justify-center sm:col-span-6 lg:col-span-2">{children}</div>
)

export const BrandTitle = (): React.ReactNode => (
  <div className="flex items-center justify-center gap-2">
    <MessageCircle size={18} style={{ color: 'var(--color-brand)' }} />
    <span
      className="text-sm font-semibold tracking-widest"
      style={{ fontVariant: 'small-caps', color: 'var(--color-text)', fontFamily: 'var(--font-ui)' }}
    >
      StreetLogic AI
    </span>
  </div>
)

export const ConfidenceSection = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="order-3 col-span-12 lg:order-2 lg:col-span-8">
    <p
      className="mb-1 text-center text-xs font-medium uppercase tracking-widest"
      style={{ color: 'var(--color-text-muted)' }}
    >
      Your current stance
    </p>
    {children}
  </div>
)

export const NewClaimSection = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="order-2 col-span-12 flex flex-col justify-center sm:col-span-6 sm:pr-2 lg:order-3 lg:col-span-2">
    {children}
  </div>
)

export const NewClaimButton = ({ onPress }: { onPress: () => void }): React.ReactNode => (
  <Button className="mx-auto w-full max-w-[250px]" onPress={onPress} variant="secondary">
    <MessageSquarePlus className="mr-2" size={16} />
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
    className="mx-auto min-w-full sm:min-w-[600px]"
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
