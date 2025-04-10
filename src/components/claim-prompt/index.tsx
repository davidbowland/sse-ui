import React, { useEffect, useRef, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
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
  onClaimSelect: (claim: string, confidence: string, language: string) => void
  skipFirstScroll?: boolean
}

type ClaimPromptStage = 'input' | 'generating' | 'selecting' | 'confidence' | 'submitted'

const ClaimPrompt = ({ onClaimSelect, skipFirstScroll }: ClaimPromptProps): React.ReactNode => {
  const [claimInput, setClaimInput] = useState<string>('')
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

  const onClaimSubmit = async (claim: string) => {
    setClaimInput(claim)
    setPromptStage('generating')
    setInputErrorMessage(undefined)
    const { inappropriate } = await validateClaim(claim, language)
    if (inappropriate) {
      setInputErrorMessage('Invalid or inappropriate claim')
      setPromptStage('input')
    } else {
      setPromptStage('selecting')
    }
  }

  const onSuggestionsRequested = async () => {
    setPromptStage('generating')
    setInputErrorMessage(undefined)
    await fetchSuggestedClaims(language)
    setPromptStage('selecting')
  }

  /* Selecting */

  const onAcceptClaim = (claim: string) => {
    setClaimInput(claim)
    setPromptStage('confidence')
  }

  const onSelectingBack = () => {
    setPromptStage('input')
  }

  /* Confidence */

  const onAcceptConfidence = (confidence: string) => {
    onClaimSelect(claimInput, confidence, language)
    setPromptStage('submitted')
  }

  const onConfidenceBack = () => {
    setPromptStage('selecting')
  }

  /* Effects */

  const scrollIntoView = () => {
    if (stageRef.current) {
      if (skipScroll) {
        setSkipScroll(false)
      } else {
        stageRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    }
  }

  useEffect(() => {
    if (promptStage === 'selecting' && suggestedClaims.length === 0 && inputErrorMessage === undefined) {
      setInputErrorMessage('Error generating claims, please input a new claim.')
      setPromptStage('input')
    }
  }, [inputErrorMessage, promptStage, suggestedClaims])

  useEffect(() => {
    setTimeout(scrollIntoView, 10)
  }, [promptStage])

  const hasErrorMessage = confidenceLevelsErrorMessage || suggestedClaimsErrorMessage
  return (
    <Stack margin="auto" maxWidth={1000} spacing={1} width="100%">
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
          sx={{ display: 'inline-block' }}
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
