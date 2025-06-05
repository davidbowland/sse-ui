import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'

export interface GeneratingStageProps {
  ref: React.RefObject<HTMLDivElement>
}

const GeneratingStage = (): React.ReactNode => {
  return (
    <Stack spacing={4} sx={{ margin: 'auto', maxWidth: 'm', padding: 3, textAlign: 'center', width: '100%' }}>
      <Typography variant="h4">Generating claims to discuss</Typography>
      <Typography fontStyle="italic" variant="body2">
        This may take a few seconds
      </Typography>
      <Box>
        <LinearProgress sx={{ margin: 'auto', maxWidth: 600 }} />
      </Box>
    </Stack>
  )
}

export default GeneratingStage
