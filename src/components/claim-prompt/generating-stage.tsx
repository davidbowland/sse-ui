import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export interface GeneratingStageProps {
  ref: React.RefObject<HTMLDivElement>
}

const GeneratingStage = (): React.ReactNode => {
  return (
    <Stack padding={3} spacing={4} sx={{ margin: 'auto', maxWidth: 'm', textAlign: 'center', width: '100%"' }}>
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
