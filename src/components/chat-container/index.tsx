import { useRouter } from 'next/router'
import React, { useState } from 'react'

import {
  BrandSection,
  BrandTitle,
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
  confidenceLevels: ConfidenceLevel[]
  initialConfidence?: string
  onConfidenceChange: (confidence: string) => void
}

const ChatContainer = ({
  children,
  confidenceLevels,
  initialConfidence,
  onConfidenceChange,
}: ChatContainerProps): React.ReactNode => {
  const [confidence, setConfidence] = useState<string | undefined>(initialConfidence)
  const router = useRouter()

  const onChangeOptionList = (value: string) => {
    setConfidence(value)
    onConfidenceChange(value)
  }

  return (
    <div>
      <NavBar>
        <BrandSection>
          <BrandTitle />
        </BrandSection>
        <ConfidenceSection>
          {confidenceLevels.length > 0 && (
            <ConfidenceSelect confidenceLevels={confidenceLevels} onChange={onChangeOptionList} value={confidence} />
          )}
        </ConfidenceSection>
        <NewClaimSection>
          <NewClaimButton onPress={() => router.push('/')} />
        </NewClaimSection>
      </NavBar>
      <div>{children}</div>
      <div className="pt-24 text-center">
        <PrivacyLink />
      </div>
    </div>
  )
}

export default ChatContainer
