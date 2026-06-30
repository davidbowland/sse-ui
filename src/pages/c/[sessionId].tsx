import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import ChatContainer from '@components/chat-container'
import ChatWindow from '@components/chat-window'
import { useSession } from '@hooks/useSession'

const SessionPage = (): React.ReactNode => {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const match = window.location.pathname.match(/\/c\/([^/]+)/)
    if (match) setSessionId(match[1])
  }, [router.asPath])

  const {
    chatStep,
    claim,
    confidence,
    confidenceLevels,
    conversationSteps,
    dividers,
    errorMessage,
    finished,
    history,
    isLoading,
    onChangeConfidence,
    sendChatMessage,
  } = useSession(sessionId)

  if (!sessionId) return null

  const currentStepIndex = conversationSteps.findIndex((s) => s.value === chatStep)

  return (
    <>
      <Head>
        <title>StreetLogic AI | Chat</title>
      </Head>
      <main style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)' }}>
        <ChatContainer
          claim={claim}
          confidenceLevels={confidenceLevels}
          errorMessage={errorMessage}
          initialConfidence={confidence}
          key={claim}
          onConfidenceChange={onChangeConfidence}
        >
          {/* Conversation step progress */}
          {conversationSteps.length > 0 && (
            <div className="w-full text-center">
              <nav aria-label="Conversation progress" className="w-full overflow-hidden">
                <ol className="flex items-start justify-center gap-1 steps-lines:gap-3">
                  {conversationSteps.map((step, index) => {
                    const isActive = chatStep === step.value
                    const isDone = currentStepIndex > index
                    return (
                      <React.Fragment key={index}>
                        {index > 0 && (
                          <li
                            aria-hidden="true"
                            className="hidden h-px w-5 flex-shrink-0 steps-lines:block steps-lines:w-8"
                            style={{
                              backgroundColor: isDone ? 'var(--accent)' : 'var(--border)',
                              marginTop: '14px',
                              opacity: isDone ? 0.5 : 1,
                            }}
                          />
                        )}
                        <li className="flex w-auto flex-col items-center gap-1.5 steps-labels:w-[100px]">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                            style={{
                              fontFamily: 'var(--font)',
                              transition: 'all 0.16s cubic-bezier(0.32,0.72,0,1)',
                              ...(isActive
                                ? { backgroundColor: 'var(--accent)', color: 'var(--bg)' }
                                : isDone
                                  ? { backgroundColor: 'var(--accent)', color: 'var(--bg)' }
                                  : {
                                      backgroundColor: 'var(--accent-dim)',
                                      border: '1px solid var(--accent-14)',
                                      color: 'var(--text-muted)',
                                    }),
                            }}
                          >
                            {isDone ? '✓' : index + 1}
                          </span>
                          <span
                            className="hidden text-xs steps-labels:block"
                            style={{
                              fontFamily: 'var(--font)',
                              color: isActive ? 'var(--text)' : 'var(--text-muted)',
                              fontWeight: isActive ? 500 : 400,
                            }}
                          >
                            {step.label}
                          </span>
                        </li>
                      </React.Fragment>
                    )
                  })}
                </ol>
              </nav>
            </div>
          )}

          <ChatWindow
            dividers={dividers}
            finished={finished}
            history={history}
            isTyping={isLoading}
            sendChatMessage={sendChatMessage}
          />
        </ChatContainer>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  if (process.env.NODE_ENV === 'development') {
    return { fallback: 'blocking', paths: [] }
  }
  return { fallback: false, paths: [{ params: { sessionId: '__placeholder__' } }] }
}

export const getStaticProps: GetStaticProps = () => ({ props: {} })

export default SessionPage
