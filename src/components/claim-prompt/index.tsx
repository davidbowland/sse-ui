import React, { useCallback, useEffect, useRef, useState } from 'react'

import ConfidenceStage from './confidence-stage'
import { ErrorAlert, StepIndicator } from './elements'
import GeneratingStage from './generating-stage'
import InputStage from './input-stage'
import SelectingStage from './selecting-stage'
import SubmittedStage from './submitted-stage'
import { useConfidenceLevels } from '@hooks/useConfidenceLevels'
import { useSuggestedClaims } from '@hooks/useSuggestedClaims'

export interface ClaimPromptProps {
  initialClaim?: string
  onClaimSelect: (claim: string, confidence: string, language: string) => Promise<void>
  skipFirstScroll?: boolean
}

type ClaimPromptStage = 'input' | 'generating' | 'selecting' | 'confidence' | 'submitted'

const stageToStep = (stage: ClaimPromptStage): number => {
  if (stage === 'selecting') return 2
  if (stage === 'confidence') return 3
  if (stage === 'submitted') return 4
  return 1
}

const ClaimPrompt = ({ initialClaim, onClaimSelect, skipFirstScroll }: ClaimPromptProps): React.ReactNode => {
  const [claimInput, setClaimInput] = useState<string>(initialClaim ?? '')
  const [inputErrorMessage, setInputErrorMessage] = useState<string | undefined>(undefined)
  const [language, setLanguage] = useState<string>('en-US')

  useEffect(() => {
    const urlLanguage = new URLSearchParams(window.location.search).get('language')
    if (urlLanguage) {
      setLanguage(urlLanguage)
    }
  }, [])
  const [promptStage, setPromptStage] = useState<ClaimPromptStage>('input')
  const [skipScroll, setSkipScroll] = useState<boolean>(skipFirstScroll ?? false)
  const stageRef = useRef<HTMLElement>(null)

  const { confidenceLevels, errorMessage: confidenceLevelsErrorMessage } = useConfidenceLevels()
  const {
    errorMessage: suggestedClaimsErrorMessage,
    fetchSuggestedClaims,
    suggestedClaims,
    validateClaim,
  } = useSuggestedClaims()

  /* Input */

  const onClaimSubmit = useCallback(
    async (claim: string) => {
      setClaimInput(claim)
      setPromptStage('generating')
      setInputErrorMessage(undefined)
      const { inappropriate } = await validateClaim(claim, language)
      if (inappropriate) {
        setInputErrorMessage("We couldn't validate that claim. Try rephrasing it.")
        setPromptStage('input')
      } else {
        setPromptStage('selecting')
      }
    },
    [validateClaim, language],
  )

  const onSuggestionsRequested = useCallback(async () => {
    setPromptStage('generating')
    setInputErrorMessage(undefined)
    await fetchSuggestedClaims(language)
    setPromptStage('selecting')
  }, [fetchSuggestedClaims, language])

  /* Selecting */

  const onAcceptClaim = useCallback((claim: string) => {
    setClaimInput(claim)
    setPromptStage('confidence')
  }, [])

  const onSelectingBack = useCallback(() => {
    setPromptStage('input')
  }, [])

  /* Confidence */

  const onAcceptConfidence = useCallback(
    (confidence: string) => {
      setPromptStage('submitted')
      onClaimSelect(claimInput, confidence, language).catch((error: unknown) => {
        setInputErrorMessage("We couldn't start your chat. Try again in a moment.")
        setPromptStage('confidence')
        console.error('Error creating session', { error })
      })
    },
    [onClaimSelect, claimInput, language],
  )

  const onConfidenceBack = useCallback(() => {
    setPromptStage('selecting')
  }, [])

  /* Effects */

  const scrollIntoView = useCallback(() => {
    if (stageRef.current) {
      if (skipScroll) {
        setSkipScroll(false)
      } else {
        stageRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    }
  }, [skipScroll])

  useEffect(() => {
    if (promptStage === 'selecting' && suggestedClaims.length === 0 && inputErrorMessage === undefined) {
      setInputErrorMessage("We couldn't generate suggestions. Try again in a moment.")
      setPromptStage('input')
    }
  }, [inputErrorMessage, promptStage, suggestedClaims])

  useEffect(() => {
    setTimeout(scrollIntoView, 10)
  }, [promptStage])

  const hasErrorMessage = confidenceLevelsErrorMessage || suggestedClaimsErrorMessage
  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8">
      {hasErrorMessage && (
        <ErrorAlert>
          {confidenceLevelsErrorMessage} {suggestedClaimsErrorMessage} Please refresh to try again.
        </ErrorAlert>
      )}
      <div className="w-full">
        <StepIndicator currentStep={stageToStep(promptStage)} ref={stageRef} />
      </div>
      {promptStage === 'input' && (
        <InputStage
          errorMessage={inputErrorMessage}
          initialClaim={claimInput}
          language={language}
          onClaimSubmit={onClaimSubmit}
          onLanguageChange={setLanguage}
          onSuggestionsRequested={onSuggestionsRequested}
        />
      )}
      {promptStage === 'generating' && <GeneratingStage />}
      {promptStage === 'selecting' && (
        <SelectingStage
          initialIndex={suggestedClaims.indexOf(claimInput)}
          onAcceptClaim={onAcceptClaim}
          onBack={onSelectingBack}
          suggestedClaims={suggestedClaims}
        />
      )}
      {promptStage === 'confidence' && (
        <ConfidenceStage
          claim={claimInput}
          confidenceLevels={confidenceLevels}
          errorMessage={inputErrorMessage}
          key={claimInput}
          onAcceptConfidence={onAcceptConfidence}
          onBack={onConfidenceBack}
        />
      )}
      {promptStage === 'submitted' && <SubmittedStage />}
    </div>
  )
}

export default ClaimPrompt
