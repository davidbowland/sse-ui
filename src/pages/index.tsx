import Box from '@mui/material/Box'
import ChatIcon from '@mui/icons-material/Chat'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { navigate } from 'gatsby'
import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ClaimPrompt from '@components/claim-prompt'
import { createSession } from '@services/sse'
import PrivacyLink from '@components/privacy-link'

const exampleClaimSx = { color: 'text.secondary', fontStyle: 'italic', fontWeight: 700 }

const Index = (): React.ReactNode => {
  const onClaimSelect = async (claim: string, confidence: string) => {
    const { sessionId } = await createSession(claim, confidence)
    navigate(`/s/${encodeURIComponent(sessionId)}`)
  }

  return (
    <main style={{ minHeight: '90vh' }}>
      <Grid container sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item sx={{ m: 'auto', maxWidth: 1200, width: '100%' }}>
          <Stack spacing={3} sx={{ minHeight: '80vh', textAlign: 'center' }}>
            <Typography sx={{ fontSize: { sm: 64, xs: 44 }, fontWeight: 700, letterSpacing: '0.2rem' }} variant="h2">
              <ChatIcon sx={{ fontSize: { sm: 36, xs: 28 }, mr: 2 }} />
              StreetLogic AI
            </Typography>
            <Typography variant="h4">Explore your confidence in what you believe</Typography>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ margin: 'auto', maxWidth: 800 }} variant="body1">
                A truth claim can be as simple as{' '}
                <Typography component="span" sx={exampleClaimSx}>
                  my city is the best city to live in
                </Typography>
                , as silly as{' '}
                <Typography component="span" sx={exampleClaimSx}>
                  Danny Trejo is a good role model
                </Typography>
                , or as profound as{' '}
                <Typography component="span" sx={exampleClaimSx}>
                  my spouse loves me
                </Typography>
                . Enter a truth claim below to get started or have some claims suggested for you.
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ minHeight: '60vh', width: '100%' }}>
              <ClaimPrompt onClaimSelect={onClaimSelect} skipFirstScroll />
            </Box>
          </Stack>
          <PrivacyLink />
        </Grid>
      </Grid>
    </main>
  )
}

export const Head = () => <title>StreetLogic AI</title>

export default Index
