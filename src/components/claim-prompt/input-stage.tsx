import { Input, Switch } from '@heroui/react'
import React, { useCallback, useState } from 'react'

import { PrimaryButton, SecondaryButton } from './elements'
import TwoButtons from './two-buttons'
import { useBrowserLanguage } from '@hooks/useBrowserLanguage'

export interface InputStageProps {
  errorMessage?: string
  initialClaim: string
  language: string
  onClaimSubmit: (claim: string) => void
  onLanguageChange: (language: string) => void
  onSuggestionsRequested: () => void
}

const InputStage = ({
  errorMessage,
  initialClaim,
  language,
  onClaimSubmit,
  onLanguageChange,
  onSuggestionsRequested,
}: InputStageProps): React.ReactNode => {
  const [claimInput, setClaimInput] = useState<string>(initialClaim)
  const { browserLanguage } = useBrowserLanguage()

  const handleLanguageChange = useCallback(
    (checked: boolean) => {
      onLanguageChange(checked ? browserLanguage : 'en-US')
    },
    [onLanguageChange, browserLanguage],
  )

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onClaimSubmit(claimInput.trim())
      }
    },
    [onClaimSubmit, claimInput],
  )

  const submitClaim = useCallback(() => {
    onClaimSubmit(claimInput.trim())
  }, [onClaimSubmit, claimInput])

  return (
    <div className="mx-auto flex w-full flex-col gap-0 px-2 text-center">
      <div className="pb-6">
        <h4 className="text-3xl font-normal">Submit claim</h4>
      </div>
      <Input
        className="mb-6 w-full"
        errorMessage={errorMessage}
        isInvalid={errorMessage !== undefined}
        label="Truth claim"
        onChange={(e) => setClaimInput(e.target.value)}
        onKeyUp={handleKeyUp}
        value={claimInput}
      />
      <TwoButtons
        button1={<SecondaryButton onPress={onSuggestionsRequested}>Suggest claims</SecondaryButton>}
        button2={<PrimaryButton onPress={submitClaim}>Submit</PrimaryButton>}
      />
      <p className="pb-8 pt-8 text-sm">Suggested claims are only updated a few times per day</p>
      {browserLanguage !== 'en-US' && browserLanguage && (
        <div>
          <h5 className="text-2xl font-normal">Chat language</h5>
          <div className="text-sm">
            en-US
            <Switch
              aria-label="Chat language switch"
              isSelected={language === browserLanguage}
              onValueChange={handleLanguageChange}
            />
            {browserLanguage}
          </div>
        </div>
      )}
    </div>
  )
}

export default InputStage
