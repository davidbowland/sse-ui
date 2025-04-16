import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

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

  const generateLanguageSelector = () => {
    return (
      <Box>
        <Typography variant="h5">Chat language</Typography>
        <Typography variant="body2">
          en-US
          <Switch
            aria-label="Chat language switch"
            checked={language === browserLanguage}
            onChange={(e: any) => onLanguageChange(e.target.checked ? browserLanguage : 'en-US')}
          />
          {browserLanguage}
        </Typography>
      </Box>
    )
  }

  const submitClaim = () => {
    onClaimSubmit(claimInput)
  }

  return (
    <Stack sx={{ margin: 'auto', maxWidth: 'l', padding: 2, textAlign: 'center', width: '100%"' }}>
      <Box sx={{ paddingBottom: 3 }}>
        <Typography variant="h4">Submit claim</Typography>
      </Box>
      <TextField
        error={errorMessage !== undefined}
        helperText={errorMessage}
        label="Truth claim"
        onInput={(e: any) => setClaimInput(e.target.value)}
        sx={{ paddingBottom: 3, width: '100%' }}
        value={claimInput}
        variant="outlined"
      />
      <TwoButtons
        button1={
          <Button color="secondary" onClick={() => onSuggestionsRequested()} sx={{ width: '100%' }} variant="contained">
            Suggest claims
          </Button>
        }
        button2={
          <Button onClick={submitClaim} sx={{ width: '100%' }} variant="contained">
            Submit
          </Button>
        }
      />
      <Typography sx={{ paddingBottom: 4, paddingTop: 4 }} variant="body2">
        Suggested claims are only updated a few times per day
      </Typography>
      {browserLanguage !== 'en-US' && browserLanguage && generateLanguageSelector()}
    </Stack>
  )
}

export default InputStage
