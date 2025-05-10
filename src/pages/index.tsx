import ClaimPrompt from '@components/claim-prompt'
import PrivacyLink from '@components/privacy-link'
import ChatIcon from '@mui/icons-material/Chat'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { createSession } from '@services/sse'
import { navigate } from 'gatsby'
import React, { useMemo } from 'react'

const exampleClaimSx = { color: 'text.secondary', fontStyle: 'italic', fontWeight: 700 }

const Index = (): React.ReactNode => {
  const onClaimSelect = async (claim: string, confidence: string, language: string) => {
    const { sessionId } = await createSession(claim, confidence, language)
    navigate(`/c/${encodeURIComponent(sessionId)}`)
  }

  const searchText = typeof window === 'undefined' ? '' : window.location.search
  const initialClaim = useMemo(() => new URLSearchParams(searchText).get('claim') || undefined, [searchText])

  return (
    <main style={{ minHeight: '90vh' }}>
      <Grid container sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item sx={{ m: 'auto', maxWidth: 1200, width: '100%' }}>
          <Stack spacing={3} sx={{ minHeight: '80vh', textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: { sm: 64, xs: 44 },
                fontVariant: 'small-caps',
                fontWeight: 700,
                letterSpacing: '0.2rem',
                padding: '0 0.1rem',
              }}
              variant="h2"
            >
              <ChatIcon sx={{ fontSize: { sm: 36, xs: 28 }, mr: 2 }} />
              StreetLogic AI
            </Typography>
            <Typography sx={{ padding: '0 0.5rem' }} variant="h4">
              Explore your confidence in what you believe
            </Typography>
            <Box>
              <Typography sx={{ margin: 'auto', maxWidth: 800, padding: '0 1rem' }} variant="body1">
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
                  God exists
                </Typography>
                . Enter a truth claim below to get started or have some claims suggested for you.
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ margin: 'auto', maxWidth: 800, padding: '0 1rem' }} variant="body1">
                If this is your first time here, it&apos;s recommended that you start with suggested claims.
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ minHeight: '90vh' }}>
              <ClaimPrompt initialClaim={initialClaim} onClaimSelect={onClaimSelect} skipFirstScroll />
            </Box>
            <Box>
              <Typography sx={{ margin: 'auto', maxWidth: 800, padding: '0 1rem' }} variant="body1">
                We do not use your interactions with this site to train AI models. We store claims, chat history, and
                associated information for roughly 24-48 hours&nbsp;-- allowing you to resume a conversation or refer
                back to it&nbsp;-- then permanently delete the conversation.
              </Typography>
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
