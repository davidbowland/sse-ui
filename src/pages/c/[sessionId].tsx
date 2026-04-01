import { AlertContent, AlertDescription, AlertRoot, Card, CardContent, Skeleton } from '@heroui/react'
import { ChevronRight } from 'lucide-react'
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

  return (
    <>
      <Head>
        <title>StreetLogic AI | Chat</title>
      </Head>
      <main style={{ minHeight: '90vh' }}>
        <ChatContainer
          confidenceLevels={confidenceLevels}
          initialConfidence={confidence}
          key={claim}
          onConfidenceChange={onChangeConfidence}
        >
          <div className="px-[10px] py-[25px] sm:px-[50px] sm:py-[50px]">
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="flex flex-col gap-2">
                <div className="pb-2">
                  {errorMessage ? (
                    <AlertRoot ref={errorMessageRef} status="danger">
                      <AlertContent>
                        <AlertDescription>
                          {errorMessage} Please refresh to try again. Chat sessions expire after 24 hours.
                        </AlertDescription>
                      </AlertContent>
                    </AlertRoot>
                  ) : (
                    <Card className="mx-auto text-center" style={{ backgroundColor: '#6373fa' }}>
                      <CardContent>
                        <p className="mb-1 text-sm text-default-500">Claim:</p>
                        <h5 className="text-2xl font-normal">
                          {claim ? (
                            claim
                          ) : (
                            <>
                              <Skeleton className="h-6 w-full" />
                              <Skeleton className="hidden h-6 w-full md:block" />
                              <Skeleton className="hidden h-6 w-full sm:block" />
                            </>
                          )}
                        </h5>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <div className="w-full text-center">
                  <nav aria-label="Breadcrumbs" className="inline-block">
                    <ol className="m-0 flex list-none items-center gap-1 p-0">
                      {conversationSteps.map((step, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && (
                            <li aria-hidden="true" className="flex items-center">
                              <ChevronRight size={16} />
                            </li>
                          )}
                          <li>
                            <span className={chatStep === step.value ? 'font-bold italic' : ''}>{step.label}</span>
                          </li>
                        </React.Fragment>
                      ))}
                    </ol>
                  </nav>
                </div>
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
