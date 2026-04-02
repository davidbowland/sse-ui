import { AlertContent, AlertDescription, AlertRoot, Skeleton } from '@heroui/react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

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

  const errorMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollErrorIntoView = () =>
      errorMessageRef?.current && errorMessageRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    setTimeout(scrollErrorIntoView, 10)
  }, [errorMessage])

  if (!sessionId) return null

  const currentStepIndex = conversationSteps.findIndex((s) => s.value === chatStep)

  return (
    <>
      <Head>
        <title>StreetLogic AI | Chat</title>
      </Head>
      <main style={{ minHeight: '90vh', backgroundColor: 'var(--color-bg)' }}>
        <ChatContainer
          confidenceLevels={confidenceLevels}
          initialConfidence={confidence}
          key={claim}
          onConfidenceChange={onChangeConfidence}
        >
          <div className="px-[10px] py-[25px] sm:px-[50px] sm:py-[50px]">
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="flex flex-col gap-4">
                {/* Claim card or error */}
                <div>
                  {errorMessage ? (
                    <AlertRoot ref={errorMessageRef} status="danger">
                      <AlertContent>
                        <AlertDescription>
                          {errorMessage} Please refresh to try again. Chat sessions expire after 24 hours.
                        </AlertDescription>
                      </AlertContent>
                    </AlertRoot>
                  ) : (
                    <div
                      className="mx-auto max-w-[800px] rounded-xl px-6 py-5 text-center text-white"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-brand) 0%, #4a5de8 100%)',
                        boxShadow: '0 4px 24px rgba(99, 115, 250, 0.25)',
                      }}
                    >
                      <p
                        className="mb-2 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        Claim
                      </p>
                      {claim ? (
                        <h5
                          className="text-2xl font-normal italic"
                          style={{ fontFamily: 'var(--font-display)', color: '#fff' }}
                        >
                          {claim}
                        </h5>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="hidden h-6 w-full md:block" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Conversation step progress */}
                {conversationSteps.length > 0 && (
                  <div className="w-full text-center">
                    <nav aria-label="Conversation progress" className="w-full overflow-hidden">
                      <ol className="flex items-center justify-center gap-1 steps-lines:gap-3">
                        {conversationSteps.map((step, index) => {
                          const isActive = chatStep === step.value
                          const isDone = currentStepIndex > index
                          return (
                            <React.Fragment key={index}>
                              {index > 0 && (
                                <li
                                  aria-hidden="true"
                                  className="hidden h-px w-5 flex-shrink-0 steps-lines:block steps-lines:w-8"
                                  style={{ backgroundColor: 'var(--color-border)' }}
                                />
                              )}
                              <li className="flex w-auto flex-col items-center gap-1.5 steps-labels:w-[100px]">
                                <span
                                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200"
                                  style={
                                    isActive
                                      ? { backgroundColor: 'var(--color-brand)', color: '#fff' }
                                      : isDone
                                        ? {
                                            backgroundColor: 'var(--color-brand-dim)',
                                            color: 'var(--color-brand)',
                                          }
                                        : {
                                            backgroundColor: 'rgba(128,128,128,0.12)',
                                            color: 'var(--color-text-muted)',
                                          }
                                  }
                                >
                                  {isDone ? '✓' : index + 1}
                                </span>
                                <span
                                  className="hidden text-xs steps-labels:block"
                                  style={{
                                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                                    fontWeight: isActive ? '500' : '400',
                                    fontFamily: 'var(--font-ui)',
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
              </div>
            </div>
          </div>
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
