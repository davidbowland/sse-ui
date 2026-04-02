import React from 'react'

import { HeroDivider, HeroSection, PageMain, PrivacyNote } from './elements'
import ClaimPrompt from '@components/claim-prompt'
import PrivacyLink from '@components/privacy-link'

export interface HomePageProps {
  initialClaim?: string
  onClaimSelect: (claim: string, confidence: string, language: string) => Promise<void>
}

const HomePage = ({ initialClaim, onClaimSelect }: HomePageProps): React.ReactNode => (
  <PageMain>
    <div className="flex min-h-[80vh] flex-col gap-8 text-center">
      <HeroSection />
      <HeroDivider />
      <div style={{ minHeight: '70vh' }}>
        <ClaimPrompt initialClaim={initialClaim} onClaimSelect={onClaimSelect} skipFirstScroll />
      </div>
      <PrivacyNote />
    </div>
    <PrivacyLink />
  </PageMain>
)

export default HomePage
