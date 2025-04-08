import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Grid from '@mui/material/Grid'
import React from 'react'
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
    finished,
    history,
    isLoading,
    sendChatMessage,
  } = useSession(params.sessionId)

  const onConfidenceChange = (confidence: string) => {
    if (confidence === undefined) {
      return
    }
  }

  return (
    <main style={{ minHeight: '90vh' }}>
      <ChatContainer
        confidenceLevels={confidenceLevels}
        initialConfidence={confidence}
        key={claim}
        onConfidenceChange={onConfidenceChange}
      >
        <Grid container sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
          <Grid item sx={{ m: 'auto', maxWidth: 1200, width: '100%' }}>
            <Stack spacing={1}>
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
