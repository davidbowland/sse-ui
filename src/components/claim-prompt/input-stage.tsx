import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import TwoButtons from './two-buttons'

export interface InputStageProps {
  errorMessage?: string
  initialClaim: string
  onClaimSubmit: (claim: string) => void
  onSuggestionsRequested: () => void
}

const InputStage = ({
  errorMessage,
  initialClaim,
  onClaimSubmit,
  onSuggestionsRequested,
}: InputStageProps): React.ReactNode => {
  const [claimInput, setClaimInput] = useState<string>(initialClaim)

  return (
    <Stack padding={2} spacing={1} sx={{ margin: 'auto', maxWidth: 'l', textAlign: 'center', width: '100%"' }}>
      <TextField
        error={errorMessage !== undefined}
        helperText={errorMessage}
        label="Truth claim"
        onChange={(e: any) => setClaimInput(e.target.value)}
        sx={{ width: '100%' }}
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
          <Button onClick={() => onClaimSubmit(claimInput)} sx={{ width: '100%' }} variant="contained">
            Submit
          </Button>
        }
      />
      <Typography padding={2} variant="body2">
        Suggested claims are only updated a few times per day
      </Typography>
    </Stack>
  )
}

export default InputStage
