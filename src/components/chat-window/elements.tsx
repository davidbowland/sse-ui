import { Button, Separator } from '@heroui/react'
import { MessageSquarePlus, Send } from 'lucide-react'
import React, { ForwardedRef, forwardRef } from 'react'

import { ChatRole } from '@types'

export const ChatHistoryCard = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div
    style={{
      background: 'color-mix(in srgb, var(--accent) 2%, transparent)',
      border: '1px solid color-mix(in srgb, var(--accent) 6%, transparent)',
      borderRadius: '26px',
      padding: '6px',
    }}
  >
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: '22px',
        padding: '20px',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {children}
    </div>
  </div>
)

export const TypingSkeletons = (): React.ReactNode => (
  <div className="grid grid-cols-12">
    <div className="col-span-2 sm:col-span-3" />
    <div className="col-span-10 sm:col-span-9">
      <div
        style={{
          background: 'var(--chat-ai-bg)',
          borderLeft: '2px solid var(--accent-30)',
          borderRadius: '0 15px 15px 0',
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--accent)',
                animation: `bounce 1.3s ease-in-out infinite ${delay}s`,
              }}
            />
          ))}
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
            style={{
              width: '100%',
              borderRadius: isAssistant ? '0 15px 15px 0' : '15px 0 0 15px',
              padding: '13px 16px',
              ...(isAssistant
                ? {
                    background: 'var(--chat-ai-bg)',
                    borderLeft: '2px solid var(--chat-ai-border)',
                  }
                : {
                    background: 'var(--chat-user-bg)',
                    borderRight: '2px solid var(--chat-user-border)',
                  }),
            }}
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
    style={{ fontFamily: 'var(--font)', color: 'var(--text)', lineHeight: 1.67 }}
  >
    {children}
  </p>
)

export const NewClaimButton = ({ onPress }: { onPress: () => void }): React.ReactNode => (
  <div className="text-center">
    <Button
      className="w-full max-w-[350px]"
      onPress={onPress}
      style={{
        background: 'var(--accent)',
        color: 'var(--bg)',
        fontWeight: 700,
        borderRadius: '12px',
        fontFamily: 'var(--font)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <MessageSquarePlus size={16} />
      New claim
    </Button>
  </div>
)

export const SendButton = ({ isDisabled, onPress }: { isDisabled: boolean; onPress: () => void }): React.ReactNode => (
  <Button
    className="h-full w-full"
    isDisabled={isDisabled}
    onPress={onPress}
    style={{
      background: isDisabled ? 'var(--surface-alt)' : 'var(--accent)',
      color: isDisabled ? 'var(--text-muted)' : 'var(--bg)',
      fontWeight: 700,
      borderRadius: '12px',
      fontFamily: 'var(--font)',
      border: isDisabled ? '1px solid var(--border)' : 'none',
      opacity: 1,
      transition: 'background 0.15s, color 0.15s, transform 0.12s cubic-bezier(0.32,0.72,0,1)',
    }}
  >
    <Send size={16} />
    Send
  </Button>
)

export const DividerWithLabel = ({ label }: { label: string }): React.ReactNode => (
  <div className="flex items-center gap-2">
    <Separator className="flex-1" />
    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font)' }}>{label}</span>
    <Separator className="flex-1" />
  </div>
)
