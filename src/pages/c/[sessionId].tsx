import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Grid from '@mui/material/Grid'
import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ChatContainer from '@components/chat-container'
import ChatWindow from '@components/chat-window'
import { useSession } from '@hooks/useSession'

const claimSx = { color: 'text.secondary', fontStyle: 'italic', fontWeight: 700 }
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
    finished,
    history,
    isLoading,
    onChangeConfidence,
    sendChatMessage,
  } = useSession(params.sessionId)

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
                <Alert severity="success" sx={{ margin: 'auto', maxWidth: 600 }}>
                  <Typography component="span" sx={{ fontWeight: 700, marginRight: 1 }}>
                    Claim:
                  </Typography>
                  <Typography component="span" sx={claimSx}>
                    {claim}
                  </Typography>
                </Alert>
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
