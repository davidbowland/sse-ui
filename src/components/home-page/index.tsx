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
    <div className="flex flex-col gap-8 text-center sm:min-h-[80vh] sm:justify-between">
      <div className="flex flex-col gap-8">
        <HeroSection />
        <HeroDivider />
        <ClaimPrompt initialClaim={initialClaim} onClaimSelect={onClaimSelect} skipFirstScroll />
      </div>
      <PrivacyNote />
    </div>
    <PrivacyLink />
  </PageMain>
)

export default HomePage
