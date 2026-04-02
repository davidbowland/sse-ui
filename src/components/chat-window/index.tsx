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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      const capped = Math.min(el.scrollHeight, 200)
      el.style.height = capped + 'px'
      el.style.overflowY = el.scrollHeight > 200 ? 'auto' : 'hidden'
    }
  }, [])

  const sendMessage = useCallback(() => {
    if (!isTyping && message.trim().length) {
      sendChatMessage(message)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
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
            {dividers[index] && (
              <div className="py-2">
                <DividerWithLabel label={dividers[index].label} />
              </div>
            )}
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
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 sm:col-span-9">
            <textarea
              aria-label="Message"
              className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition-colors"
              onChange={(e) => {
                setMessage(e.target.value.replace(/\n/g, '').slice(0, MAX_CHAT_LENGTH))
                resizeTextarea()
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              ref={textareaRef}
              rows={1}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-ui)',
                caretColor: 'var(--color-brand)',
                minHeight: '46px',
                maxHeight: '200px',
              }}
              value={message}
            />
          </div>
          <div className="col-span-12 sm:col-span-3">
            <SendButton isDisabled={finished || isTyping || !message.length} onPress={sendMessage} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatWindow
