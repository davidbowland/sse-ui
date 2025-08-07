import React, { useCallback, useEffect, useRef, useState } from 'react'

import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ConfidenceStage from './confidence-stage'
import GeneratingStage from './generating-stage'
import InputStage from './input-stage'
import SelectingStage from './selecting-stage'
import SubmittedStage from './submitted-stage'
import { useConfidenceLevels } from '@hooks/useConfidenceLevels'
import { useSuggestedClaims } from '@hooks/useSuggestedClaims'

const selectedSx = { color: 'text.primary', fontStyle: 'italic', fontWeight: 700 }
const unselectedSx = {}

export interface ClaimPromptProps {
  initialClaim?: string
  onClaimSelect: (claim: string, confidence: string, language: string) => Promise<void>
  skipFirstScroll?: boolean
}

type ClaimPromptStage = 'input' | 'generating' | 'selecting' | 'confidence' | 'submitted'

const ClaimPrompt = ({ initialClaim, onClaimSelect, skipFirstScroll }: ClaimPromptProps): React.ReactNode => {
  const [claimInput, setClaimInput] = useState<string>(initialClaim ?? '')
  const [inputErrorMessage, setInputErrorMessage] = useState<string | undefined>(undefined)
  const [language, setLanguage] = useState<string>(
    (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('language')) || 'en-US',
  )
  const [promptStage, setPromptStage] = useState<ClaimPromptStage>('input')
  const [skipScroll, setSkipScroll] = useState<boolean>(skipFirstScroll ?? false)
  const stageRef = useRef<HTMLDivElement>(null)

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
        setInputErrorMessage(
          'Error validating claim. It may be invalid or inappropriate. Please input a new claim to try again.',
        )
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
        setInputErrorMessage('Error creating chat session. Please try again later.')
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
      setInputErrorMessage('Error generating suggested claims. Please try again later.')
      setPromptStage('input')
    }
  }, [inputErrorMessage, promptStage, suggestedClaims])

  useEffect(() => {
    setTimeout(scrollIntoView, 10)
  }, [promptStage])

  const hasErrorMessage = confidenceLevelsErrorMessage || suggestedClaimsErrorMessage
  return (
    <Stack spacing={4} sx={{ margin: 'auto', maxWidth: 1000, width: '100%' }}>
      {hasErrorMessage && (
        <Alert severity="error" sx={{ margin: 'auto', maxWidth: 600 }}>
          {confidenceLevelsErrorMessage} {suggestedClaimsErrorMessage} Please refresh to try again.
        </Alert>
      )}
      <Box sx={{ width: '100%' }}>
        <Breadcrumbs
          aria-label="Breadcrumbs"
          ref={stageRef}
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ display: 'inline-block', padding: '0 1rem' }}
        >
          <Typography sx={promptStage === 'input' ? selectedSx : unselectedSx} variant="body1">
            Submit claim
          </Typography>
          <Typography sx={promptStage === 'generating' ? selectedSx : unselectedSx} variant="body1">
            Generate claims
          </Typography>
          <Typography sx={promptStage === 'selecting' ? selectedSx : unselectedSx} variant="body1">
            Select claim
          </Typography>
          <Typography sx={promptStage === 'confidence' ? selectedSx : unselectedSx} variant="body1">
            Select your stance
          </Typography>
          <Typography sx={promptStage === 'submitted' ? selectedSx : unselectedSx} variant="body1">
            Chat begins
          </Typography>
        </Breadcrumbs>
      </Box>
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
    </Stack>
  )
}

export default ClaimPrompt
