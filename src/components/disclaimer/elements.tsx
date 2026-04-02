import { Button } from '@heroui/react'
import React from 'react'

export const DisclaimerOverlay = ({
  children,
  isOpen,
}: {
  children: React.ReactNode
  isOpen: boolean
}): React.ReactNode => (
  <div
    className={`fixed inset-x-0 bottom-0 z-50 bg-white p-4 shadow-lg dark:bg-zinc-900 ${isOpen ? '' : 'hidden'}`}
    data-testid="disclaimer-overlay"
  >
    {children}
  </div>
)

export const DisclaimerTitle = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <h6 className="mb-2 text-lg font-medium">{children}</h6>
)

export const DisclaimerContent = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-start">{children}</div>
)

export const DisclaimerText = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <p className="text-sm">{children}</p>
)

export const AcceptButton = ({ onPress }: { onPress: () => void }): React.ReactNode => (
  <Button className="w-full" onPress={onPress} variant="primary">
    Accept &amp; continue
  </Button>
)
