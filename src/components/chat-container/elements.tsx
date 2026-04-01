import { Button, ListBoxItem, Select } from '@heroui/react'
import { MessageCircle, MessageSquarePlus } from 'lucide-react'
import React from 'react'

import { ConfidenceLevel } from '@types'

export const NavBar = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <nav className="bg-primary px-4 py-2 text-primary-foreground">
    <div className="grid grid-cols-12 items-center gap-2 p-2 text-center">{children}</div>
  </nav>
)

export const BrandSection = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="col-span-12 flex flex-col justify-center sm:col-span-6 lg:col-span-2">{children}</div>
)

export const BrandTitle = (): React.ReactNode => (
  <div className="flex items-center justify-center">
    <MessageCircle className="mr-2" size={20} />
    <span className="text-sm font-bold tracking-widest" style={{ fontVariant: 'small-caps' }}>
      StreetLogic AI
    </span>
  </div>
)

export const ConfidenceSection = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="col-span-12 lg:col-span-8 lg:order-2 order-3">{children}</div>
)

export const NewClaimSection = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="col-span-12 flex flex-col justify-center sm:col-span-6 sm:pr-2 lg:col-span-2 lg:order-3 order-2">
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
    {confidenceLevels.map((level) => (
      <ListBoxItem id={level.value} key={level.value}>
        {level.label}
      </ListBoxItem>
    ))}
  </Select>
)
