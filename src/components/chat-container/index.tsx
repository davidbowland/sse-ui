import { Skeleton } from '@heroui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import {
  BrandSection,
  BrandTitle,
  CompactClaimStrip,
  ConfidenceSection,
  ConfidenceSelect,
  NavBar,
  NewClaimButton,
  NewClaimSection,
} from './elements'
import PrivacyLink from '@components/privacy-link'
import { ConfidenceLevel } from '@types'

export interface ChatContainerProps {
  children: React.ReactNode
  claim?: string
  confidenceLevels: ConfidenceLevel[]
  errorMessage?: string
  initialConfidence?: string
  onConfidenceChange: (confidence: string) => void
}

const ChatContainer = ({
  children,
  claim,
  confidenceLevels,
  errorMessage,
  initialConfidence,
  onConfidenceChange,
}: ChatContainerProps): React.ReactNode => {
  const [confidence, setConfidence] = useState<string | undefined>(initialConfidence)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isClaimOutOfView, setIsClaimOutOfView] = useState(false)
  const claimCardRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const card = claimCardRef.current
    if (!card) return
    const observer = new IntersectionObserver(([entry]) => setIsClaimOutOfView(!entry.isIntersecting), { threshold: 0 })
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  const onChangeOptionList = (value: string) => {
    setConfidence(value)
    onConfidenceChange(value)
  }

  return (
    <div>
      <NavBar>
        <div className="grid grid-cols-12 items-center gap-2 py-3 lg:pt-[19px] px-1 text-center">
          <BrandSection isHidden={isScrolled}>
            <BrandTitle />
          </BrandSection>
          <ConfidenceSection>
            {confidenceLevels.length > 0 && (
              <ConfidenceSelect confidenceLevels={confidenceLevels} onChange={onChangeOptionList} value={confidence} />
            )}
          </ConfidenceSection>
          <NewClaimSection isHidden={isScrolled}>
            <NewClaimButton onPress={() => router.push('/')} />
          </NewClaimSection>
        </div>
        <CompactClaimStrip claim={claim} data-testid="compact-claim-strip" isVisible={isClaimOutOfView} />
      </NavBar>

      <div className="px-[10px] py-[25px] sm:px-[50px] sm:py-[50px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="flex flex-col gap-4">
            {/* Claim card */}
            <div ref={claimCardRef}>
              {errorMessage ? (
                <div
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: '28px',
                    padding: '7px',
                    maxWidth: '800px',
                    margin: '0 auto',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--surface)',
                      borderRadius: '23px',
                      padding: '16px 24px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: '14px', color: 'var(--error)', fontFamily: 'var(--font)', lineHeight: 1.5 }}>
                      {errorMessage} Please refresh to try again. Chat sessions expire after 24 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="mx-auto max-w-[800px]"
                  style={{
                    background: 'color-mix(in srgb, var(--accent) 2.5%, transparent)',
                    border: '1px solid var(--border)',
                    borderRadius: '28px',
                    padding: '7px',
                  }}
                >
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, transparent) 0%, rgba(0,80,180,0.13) 100%)',
                      borderRadius: '23px',
                      padding: '18px 24px',
                      textAlign: 'center',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--accent-55)',
                        marginBottom: '8px',
                        fontFamily: 'var(--font)',
                      }}
                    >
                      Claim
                    </p>
                    {claim ? (
                      <h5
                        style={{
                          fontFamily: 'var(--font)',
                          fontSize: '17px',
                          fontWeight: 600,
                          letterSpacing: '-0.015em',
                          color: 'var(--text)',
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                        }}
                      >
                        {claim}
                      </h5>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="hidden h-5 w-full md:block" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {children}
          </div>
        </div>
      </div>

      <div className="pt-24 text-center">
        <PrivacyLink />
      </div>
    </div>
  )
}

export default ChatContainer
