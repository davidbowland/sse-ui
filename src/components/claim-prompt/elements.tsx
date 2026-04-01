import { AlertContent, AlertDescription, AlertRoot, Button, Card, CardContent } from '@heroui/react'
import { ChevronRight } from 'lucide-react'
import React from 'react'

// Alert

export const ErrorAlert = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <AlertRoot className="mx-auto max-w-[600px]" status="danger">
    <AlertContent>
      <AlertDescription>{children}</AlertDescription>
    </AlertContent>
  </AlertRoot>
)

// Claim card

export const ClaimCard = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <Card className="mx-auto" style={{ backgroundColor: '#6373fa' }}>
    <CardContent>{children}</CardContent>
  </Card>
)

export const ClaimCardLabel = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <p className="mb-1 text-sm text-default-500">{children}</p>
)

// Selection list

export const SelectionList = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <ul className="mx-auto max-w-[800px] list-none p-0">{children}</ul>
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
      className={`flex w-full items-center rounded px-4 py-2 text-left ${isSelected ? 'bg-default-200' : 'hover:bg-default-100'}`}
      onClick={onClick}
    >
      {children}
    </button>
  </li>
)

// Breadcrumb nav

export const BreadcrumbNav = React.forwardRef<HTMLElement, { children: React.ReactNode }>(({ children }, ref) => (
  <nav aria-label="Breadcrumbs" className="inline-block px-4" ref={ref}>
    <ol className="m-0 flex list-none items-center gap-1 p-0">{children}</ol>
  </nav>
))
BreadcrumbNav.displayName = 'BreadcrumbNav'

export const BreadcrumbItem = ({
  children,
  isActive,
}: {
  children: React.ReactNode
  isActive: boolean
}): React.ReactNode => (
  <li>
    <span className={isActive ? 'font-bold italic' : ''}>{children}</span>
  </li>
)

export const BreadcrumbSeparator = (): React.ReactNode => (
  <li aria-hidden="true" className="flex items-center">
    <ChevronRight size={16} />
  </li>
)

// Primary / secondary buttons (full width)

export const PrimaryButton = ({
  children,
  disabled,
  onPress,
}: {
  children: React.ReactNode
  disabled?: boolean
  onPress: () => void
}): React.ReactNode => (
  <Button className="w-full" disabled={disabled} onPress={onPress} variant="primary">
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
