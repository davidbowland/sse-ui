import { Circle, CircleDot } from 'lucide-react'
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
        <h4 className="text-3xl font-normal">What is your stance?</h4>
      </div>
      {errorMessage && <ErrorAlert>{errorMessage}</ErrorAlert>}
      <div>
        <ClaimCard>
          <ClaimCardLabel>Claim:</ClaimCardLabel>
          <h5 className="text-2xl font-normal">{claim}</h5>
        </ClaimCard>
      </div>
      <div>
        {confidenceLevels.length === 0 ? (
          <p>Error loading confidence levels. Please refresh to try again.</p>
        ) : (
          <SelectionList>
            {confidenceLevels.map((level, index) => (
              <SelectionListItem
                isSelected={selectedIndex === index}
                key={index}
                onClick={() => setSelectedIndex(index)}
              >
                <span className="mr-3">{selectedIndex === index ? <CircleDot size={20} /> : <Circle size={20} />}</span>
                {level.label}
              </SelectionListItem>
            ))}
          </SelectionList>
        )}
      </div>
      <TwoButtons
        button1={<SecondaryButton onPress={onBack}>Back</SecondaryButton>}
        button2={<PrimaryButton onPress={handleAcceptConfidence}>Select</PrimaryButton>}
        hasExtraPadding
      />
    </div>
  )
}

export default ConfidenceStage
