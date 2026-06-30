import React, { useCallback, useState } from 'react'

import {
  ClaimCard,
  ClaimCardLabel,
  ErrorAlert,
  PrimaryButton,
  SecondaryButton,
  SelectionList,
  SelectionListItem,
} from './elements'
import TwoButtons from './two-buttons'
import { ConfidenceLevel } from '@types'

export interface ConfidenceStageProps {
  claim: string
  confidenceLevels: ConfidenceLevel[]
  errorMessage?: string
  onAcceptConfidence: (confidence: string) => void
  onBack: () => void
}

const ConfidenceStage = ({
  claim,
  confidenceLevels,
  errorMessage,
  onAcceptConfidence,
  onBack,
}: ConfidenceStageProps): React.ReactNode => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const handleAcceptConfidence = useCallback(() => {
    onAcceptConfidence(confidenceLevels[selectedIndex].value)
  }, [onAcceptConfidence, confidenceLevels, selectedIndex])

  return (
    <div className="mx-auto flex w-full flex-col gap-8 text-center">
      <div>
        <h4
          style={{
            fontFamily: 'var(--font)',
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '-0.018em',
            color: 'var(--text)',
          }}
        >
          Select your stance
        </h4>
      </div>
      {errorMessage && <ErrorAlert>{errorMessage}</ErrorAlert>}
      <div>
        <ClaimCard>
          <ClaimCardLabel>Claim:</ClaimCardLabel>
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
        </ClaimCard>
      </div>
      <div>
        {confidenceLevels.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font)' }}>
            Error loading confidence levels. Please refresh to try again.
          </p>
        ) : (
          <SelectionList>
            {confidenceLevels.map((level, index) => (
              <SelectionListItem
                isSelected={selectedIndex === index}
                key={index}
                onClick={() => setSelectedIndex(index)}
              >
                {level.label}
              </SelectionListItem>
            ))}
          </SelectionList>
        )}
      </div>
      <TwoButtons
        button1={<SecondaryButton onPress={onBack}>Back</SecondaryButton>}
        button2={<PrimaryButton onPress={handleAcceptConfidence}>Select</PrimaryButton>}
      />
    </div>
  )
}

export default ConfidenceStage
