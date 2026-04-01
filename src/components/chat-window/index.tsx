import { Input } from '@heroui/react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import {
  ChatHistoryCard,
  DividerWithLabel,
  MessageBubble,
  MessageLine,
  NewClaimButton,
  SendButton,
  TypingSkeletons,
} from './elements'
import { ChatMessage, Dividers } from '@types'

const MAX_CHAT_LENGTH = 500

export interface ChatWindowProps {
  dividers: Dividers
  finished: boolean
  history: ChatMessage[]
  isTyping: boolean
  sendChatMessage: (message: string) => void
}

const ChatWindow = ({ dividers, finished, history, isTyping, sendChatMessage }: ChatWindowProps): React.ReactNode => {
  const [message, setMessage] = useState<string>('')
  const router = useRouter()

  const messageBubbleRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)

  const sendMessage = useCallback(() => {
    if (!isTyping && message.trim().length) {
      sendChatMessage(message)
      setMessage('')
    }
  }, [sendChatMessage, message, isTyping])

  const scrollIntoView = () => {
    if (messageBubbleRef.current) {
      messageBubbleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }

  useEffect(() => {
    setTimeout(scrollIntoView, 10)
  }, [history])

  return (
    <div className="flex flex-col gap-4">
      <ChatHistoryCard>
        {history.map((msg: ChatMessage, index: number) => (
          <div key={index}>
            {dividers[index] && <DividerWithLabel label={dividers[index].label} />}
            <MessageBubble ref={index === history.length - 1 ? messageBubbleRef : undefined} role={msg.role}>
              {msg.content.split('\n').map((line, lineNum) => (
                <MessageLine innerRef={messageRef} isLast={index === history.length - 1 && lineNum === 0} key={lineNum}>
                  {line}
                </MessageLine>
              ))}
            </MessageBubble>
          </div>
        ))}
        {isTyping && <TypingSkeletons />}
      </ChatHistoryCard>
      {finished ? (
        <NewClaimButton onPress={() => router.push('/')} />
      ) : (
        <div className="grid grid-cols-12">
          <div className="col-span-12 p-2 sm:col-span-9">
            <Input
              aria-label="Message"
              className="w-full"
              label="Message"
              onChange={(e) => setMessage(e.target.value.replace(/\n/g, '').slice(0, MAX_CHAT_LENGTH))}
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
              value={message}
            />
          </div>
          <div className="col-span-12 p-2 sm:col-span-3">
            <SendButton isDisabled={finished || isTyping || !message.length} onPress={sendMessage} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatWindow
