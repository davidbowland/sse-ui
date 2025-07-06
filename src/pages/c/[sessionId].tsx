import React, { useEffect, useRef } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ChatContainer from '@components/chat-container'
import ChatWindow from '@components/chat-window'
import { useSession } from '@hooks/useSession'

const selectedSx = { color: 'text.primary', fontStyle: 'italic', fontWeight: 700 }
const unselectedSx = {}

export interface SessionPageProps {
  params: {
    sessionId: string
  }
}

const SessionPage = ({ params }: SessionPageProps): React.ReactNode => {
  const {
    chatStep,
    claim,
    confidence,
    confidenceLevels,
    conversationSteps,
    dividers,
    errorMessage,
    finished,
    history,
    isLoading,
    onChangeConfidence,
    sendChatMessage,
  } = useSession(params.sessionId)

  const errorMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollErrorIntoView = () =>
      errorMessageRef?.current && errorMessageRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    setTimeout(scrollErrorIntoView, 10)
  }, [errorMessage])

  return (
    <main style={{ minHeight: '90vh' }}>
      <ChatContainer
        confidenceLevels={confidenceLevels}
        initialConfidence={confidence}
        key={claim}
        onConfidenceChange={onChangeConfidence}
      >
        <Grid container sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
          <Grid item sx={{ m: 'auto', maxWidth: 1200, width: '100%' }}>
            <Stack spacing={1}>
              <Box sx={{ paddingBottom: 1 }}>
                {errorMessage ? (
                  <Alert ref={errorMessageRef} severity="error" sx={{ margin: 'auto', maxWidth: 600 }}>
                    {errorMessage} Please refresh to try again. Chat sessions expire after 24 hours.
                  </Alert>
                ) : (
                  <Card sx={{ backgroundColor: '#6373fa', margin: 'auto', textAlign: 'center' }}>
                    <CardContent>
                      <Typography gutterBottom sx={{ color: 'text.secondary' }} variant="h6">
                        Claim:
                      </Typography>
                      <Typography variant="h5">
                        {claim ? (
                          claim
                        ) : (
                          <>
                            <Skeleton />
                            <Skeleton sx={{ display: { md: 'none', xs: 'block' }, width: '100%' }} />
                            <Skeleton sx={{ display: { sm: 'none', xs: 'block' }, width: '100%' }} />
                          </>
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Breadcrumbs aria-label="Breadcrumbs" sx={{ display: 'inline-block' }}>
                  {conversationSteps.map((step, index) => (
                    <Typography key={index} sx={chatStep === step.value ? selectedSx : unselectedSx} variant="body1">
                      {step.label}
                    </Typography>
                  ))}
                </Breadcrumbs>
              </Box>
              <ChatWindow
                dividers={dividers}
                finished={finished}
                history={history}
                isTyping={isLoading}
                sendChatMessage={sendChatMessage}
              />
            </Stack>
          </Grid>
        </Grid>
      </ChatContainer>
    </main>
  )
}

export const Head = () => <title>StreetLogic AI | Chat</title>

export default SessionPage
