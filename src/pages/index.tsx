import { Separator } from '@heroui/react'
import { MessageCircle } from 'lucide-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import ClaimPrompt from '@components/claim-prompt'
import PrivacyLink from '@components/privacy-link'
import { createSession } from '@services/sse'

const Index = (): React.ReactNode => {
  const router = useRouter()

  const onClaimSelect = useCallback(
    async (claim: string, confidence: string, language: string) => {
      const { sessionId } = await createSession(claim, confidence, language)
      router.push(`/c/${encodeURIComponent(sessionId)}`)
    },
    [router],
  )

  const [searchText, setSearchText] = useState('')
  useEffect(() => {
    setSearchText(window.location.search)
  }, [])
  const initialClaim = useMemo(() => new URLSearchParams(searchText).get('claim') || undefined, [searchText])

  return (
    <>
      <Head>
        <title>StreetLogic AI</title>
      </Head>
      <main style={{ minHeight: '90vh' }}>
        <div className="px-[10px] py-[25px] sm:px-[50px] sm:py-[50px]">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="flex min-h-[80vh] flex-col gap-6 text-center">
              <h2
                className="px-[0.1rem] font-bold tracking-[0.2rem]"
                style={{ fontSize: 'clamp(44px, 6vw, 64px)', fontVariant: 'small-caps' }}
              >
                <MessageCircle className="mr-4 inline" size={36} />
                StreetLogic AI
              </h2>
              <h4 className="px-2 text-3xl font-normal">Explore your confidence in what you believe</h4>
              <div>
                <p className="mx-auto max-w-[800px] px-4">
                  A truth claim can be as simple as{' '}
                  <span className="font-bold italic text-default-500">my city is the best city to live in</span>, as
                  silly as <span className="font-bold italic text-default-500">Danny Trejo is a good role model</span>,
                  or as profound as <span className="font-bold italic text-default-500">God exists</span>. Enter a truth
                  claim below to get started or have some claims suggested for you.
                </p>
              </div>
              <div>
                <p className="mx-auto max-w-[800px] px-4">
                  If this is your first time here, it&apos;s recommended that you start with suggested claims.
                </p>
              </div>
              <Separator />
              <div style={{ minHeight: '90vh' }}>
                <ClaimPrompt initialClaim={initialClaim} onClaimSelect={onClaimSelect} skipFirstScroll />
              </div>
              <div>
                <p className="mx-auto max-w-[800px] px-4">
                  We do not use your interactions with this site to train AI models. We store claims, chat history, and
                  associated information for roughly 24-48 hours&nbsp;-- allowing you to resume a conversation or refer
                  back to it&nbsp;-- then permanently delete the conversation.
                </p>
              </div>
            </div>
            <PrivacyLink />
          </div>
        </div>
      </main>
    </>
  )
}

export default Index
