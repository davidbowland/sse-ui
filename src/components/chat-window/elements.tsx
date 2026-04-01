import { Button, Card, CardContent, Separator, Skeleton } from '@heroui/react'
import { MessageSquarePlus, Send } from 'lucide-react'
import React, { ForwardedRef, forwardRef } from 'react'

import { ChatRole } from '@types'

export const ChatHistoryCard = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <Card>
    <CardContent className="flex min-h-[60vh] flex-col gap-4 p-4">{children}</CardContent>
  </Card>
)

export const TypingSkeletons = (): React.ReactNode => (
  <div className="grid grid-cols-12">
    <div className="col-span-2 sm:col-span-3" />
    <div className="col-span-10 sm:col-span-9">
      <Card className="w-full rounded-2xl p-4" style={{ backgroundColor: '#00BFFF' }}>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="hidden h-4 w-full md:block" />
          <Skeleton className="hidden h-4 w-full sm:block" />
        </CardContent>
      </Card>
    </div>
  </div>
)

const assistantStyle = { backgroundColor: '#00BFFF', color: '#fff' }
const userStyle = { backgroundColor: '#E5E4E2', color: '#000' }

export const MessageBubble = forwardRef(
  ({ children, role }: { children: React.ReactNode; role: ChatRole }, ref: ForwardedRef<HTMLDivElement>) => {
    const isAssistant = role === 'assistant'
    return (
      <div className="grid grid-cols-12" ref={ref}>
        {isAssistant && <div className="col-span-2 sm:col-span-3" />}
        <div className="col-span-10 sm:col-span-9">
          <Card
            className="inline-block w-full rounded-2xl p-2 text-left"
            style={isAssistant ? assistantStyle : userStyle}
          >
            <CardContent className="flex flex-col gap-0 md:gap-2">{children}</CardContent>
          </Card>
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
  <p className="py-[0.1rem] text-sm sm:text-base md:text-base" ref={isLast ? innerRef : undefined}>
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
    <span className="text-xs text-default-400">{label}</span>
    <Separator className="flex-1" />
  </div>
)
