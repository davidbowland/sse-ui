import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const SUBTITLE_OPTIONS = [
  'This oughta be fun',
  'Please be patient',
  "We're just seconds away!",
  'Just a moment',
  'Put on thinking caps now',
  'The ideal time for a bathroom break',
  'I bet you smell good',
  'Get ready to discuss!',
  "I hope you've been practicing",
  'FIGHT!',
  'How many licks DOES it take to get to the center of a Tootsie Pop?',
  '2.718281828459045',
  'Just enough time for a quick snack',
  "Let's get ready to ruuumble!",
  'Hang tight',
  'Drinks after?',
  'The best is yet to come',
  'Tick ... tock ...',
  'Un momento, por favor',
  'Going as fast as we can!',
  "I don't perform well under pressure",
  'Your patience is appreciated',
  `While you wait, the wifi password is: socrates${new Date().getFullYear()}`,
  'Almost there!',
  'Warming up my circuits',
]

const getRandomSubtitle = () => SUBTITLE_OPTIONS[Math.floor(Math.random() * SUBTITLE_OPTIONS.length)]

const GeneratingStage = (): React.ReactNode => {
  const subtitle = useMemo(() => getRandomSubtitle(), [SUBTITLE_OPTIONS])

  return (
    <Stack spacing={4} sx={{ margin: 'auto', maxWidth: 'm', padding: 3, textAlign: 'center', width: '100%"' }}>
      <Typography variant="h4">Creating chat session</Typography>
      <Typography fontStyle="italic" variant="body2">
        {subtitle}
      </Typography>
      <Box>
        <LinearProgress sx={{ margin: 'auto', maxWidth: 600 }} />
      </Box>
    </Stack>
  )
}

export default GeneratingStage
