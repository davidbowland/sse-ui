import { Button, Separator, Skeleton } from '@heroui/react'
import { MessageSquarePlus, Send } from 'lucide-react'
import React, { ForwardedRef, forwardRef } from 'react'

import { ChatRole } from '@types'

export const ChatHistoryCard = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div
    className="w-full rounded-xl p-4"
    style={{
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
    {children}
  </div>
)

export const TypingSkeletons = (): React.ReactNode => (
  <div className="grid grid-cols-12">
    <div className="col-span-2 sm:col-span-3" />
    <div className="col-span-10 sm:col-span-9">
      <div
        className="w-full rounded-2xl p-4"
        style={{
          backgroundColor: 'var(--color-assistant-bg)',
          borderLeft: '3px solid var(--color-brand)',
        }}
      >
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  </div>
)

export const MessageBubble = forwardRef(
  ({ children, role }: { children: React.ReactNode; role: ChatRole }, ref: ForwardedRef<HTMLDivElement>) => {
    const isAssistant = role === 'assistant'
    return (
      <div className="grid grid-cols-12" ref={ref}>
        {isAssistant && <div className="col-span-2 sm:col-span-3" />}
        <div className="col-span-10 sm:col-span-9">
          <div
            className="inline-block w-full rounded-2xl p-4 text-left"
            style={
              isAssistant
                ? {
                    backgroundColor: 'var(--color-assistant-bg)',
                    color: 'var(--color-assistant-text)',
                    borderLeft: '3px solid var(--color-brand)',
                  }
                : {
                    backgroundColor: 'var(--color-user-bg)',
                    color: 'var(--color-user-text)',
                  }
            }
          >
            <div className="flex flex-col gap-0 md:gap-2">{children}</div>
          </div>
        </div>
        {!isAssistant && <div className="col-span-2 sm:col-span-3" />}
      </div>
    )
  },
)
MessageBubble.displayName = 'MessageBubble'

export const MessageLine = ({
  children,
  isLast,
  innerRef,
}: {
  children: React.ReactNode
  isLast: boolean
  innerRef?: React.RefObject<HTMLParagraphElement | null>
}): React.ReactNode => (
  <p
    className="py-[0.1rem] text-sm sm:text-base"
    ref={isLast ? innerRef : undefined}
    style={{ fontFamily: 'var(--font-ui)' }}
  >
    {children}
  </p>
)

export const NewClaimButton = ({ onPress }: { onPress: () => void }): React.ReactNode => (
  <div className="text-center">
    <Button className="w-full max-w-[350px]" onPress={onPress} variant="primary">
      <MessageSquarePlus className="mr-2" size={16} />
      New claim
    </Button>
  </div>
)

export const SendButton = ({ isDisabled, onPress }: { isDisabled: boolean; onPress: () => void }): React.ReactNode => (
  <Button className="h-full w-full" isDisabled={isDisabled} onPress={onPress} variant="primary">
    <Send className="mr-2" size={16} />
    Send
  </Button>
)

export const DividerWithLabel = ({ label }: { label: string }): React.ReactNode => (
  <div className="flex items-center gap-2">
    <Separator className="flex-1" />
    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
      {label}
    </span>
    <Separator className="flex-1" />
  </div>
)
