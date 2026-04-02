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
      <main style={{ minHeight: '90vh', backgroundColor: 'var(--color-bg)' }}>
        <div className="px-[10px] py-[25px] sm:px-[50px] sm:py-[50px]">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="flex min-h-[80vh] flex-col gap-8 text-center">
              {/* Hero */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  <MessageCircle size={32} style={{ color: 'var(--color-brand)' }} />
                  <h1
                    className="font-semibold tracking-[0.15em]"
                    style={{
                      fontSize: 'clamp(36px, 5vw, 58px)',
                      fontVariant: 'small-caps',
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text)',
                    }}
                  >
                    StreetLogic AI
                  </h1>
                </div>
                <p
                  className="max-w-[520px] text-lg font-light"
                  style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-ui)' }}
                >
                  Explore your confidence in what you believe — through conversation.
                </p>
              </div>

              {/* Divider */}
              <div
                className="mx-auto w-16"
                style={{ height: '2px', backgroundColor: 'var(--color-brand)', opacity: 0.4 }}
              />

              {/* Claim prompt */}
              <div style={{ minHeight: '70vh' }}>
                <ClaimPrompt initialClaim={initialClaim} onClaimSelect={onClaimSelect} skipFirstScroll />
              </div>

              {/* Privacy note */}
              <p
                className="mx-auto max-w-[640px] px-4 text-xs"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-ui)' }}
              >
                We do not use your interactions to train AI models. Conversations are stored for 24–48 hours then
                permanently deleted.
              </p>
            </div>
            <PrivacyLink />
          </div>
        </div>
      </main>
    </>
  )
}

export default Index
