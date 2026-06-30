import React, { useCallback, useEffect, useState } from 'react'

import { PrimaryButton, SecondaryButton, SelectionList, SelectionListItem } from './elements'
import TwoButtons from './two-buttons'

export interface SelectingStageProps {
  initialIndex: number
  onAcceptClaim: (claim: string) => void
  onBack: () => void
  suggestedClaims: string[]
}

const SelectingStage = ({
  initialIndex,
  onAcceptClaim,
  onBack,
  suggestedClaims,
}: SelectingStageProps): React.ReactNode => {
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex)

  const handleAcceptClaim = useCallback(() => {
    onAcceptClaim(suggestedClaims[selectedIndex])
  }, [onAcceptClaim, suggestedClaims, selectedIndex])

  useEffect(() => {
    setSelectedIndex(initialIndex)
  }, [suggestedClaims])

  return (
    <div className="mx-auto flex w-full flex-col gap-4 text-center">
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
          Select a claim
        </h4>
      </div>
      <div>
        <SelectionList>
          {suggestedClaims.map((claim, index) => (
            <SelectionListItem isSelected={selectedIndex === index} key={index} onClick={() => setSelectedIndex(index)}>
              {claim}
            </SelectionListItem>
          ))}
        </SelectionList>
      </div>
      <TwoButtons
        button1={<SecondaryButton onPress={onBack}>Back</SecondaryButton>}
        button2={<PrimaryButton onPress={handleAcceptClaim}>Select</PrimaryButton>}
      />
    </div>
  )
}

export default SelectingStage
