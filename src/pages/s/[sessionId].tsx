import Breadcrumbs from '@mui/material/Breadcrumbs'
import Grid from '@mui/material/Grid'
import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ChatContainer from '@components/chat-container'
import ChatWindow from '@components/chat-window'
import { ConfidenceLevel } from '@types'
import PrivacyLink from '@components/privacy-link'
import { useSession } from '@hooks/useSession'

export interface SessionPageProps {
  params: {
    sessionId: string
  }
}

const SessionPage = ({ params }: SessionPageProps): React.ReactNode => {
  const { chatStep, claim, confidence, history, isLoading, sendChatMessage } = useSession(params.sessionId)

  const onConfidenceChange = (confidence: ConfidenceLevel) => {
    if (confidence === undefined) {
      return
    }
  }

  return (
    <main style={{ minHeight: '90vh' }}>
      <Grid container sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item sx={{ m: 'auto', maxWidth: 1200, width: '100%' }}>
          <ChatContainer initialConfidence={confidence} key={claim} onConfidenceChange={onConfidenceChange}>
            <Stack spacing={1}>
              <Breadcrumbs aria-label="Breadcrumb">
                <Typography fontWeight={chatStep === 'probe-confidence' ? 700 : 500} variant="body1">
                  Confidence
                </Typography>
                <Typography fontWeight={chatStep === 'probe-reasons' ? 700 : 500} variant="body1">
                  Reasons
                </Typography>
                <Typography fontWeight={chatStep === 'guess-reasons' ? 700 : 500} variant="body1">
                  Opposing reasons
                </Typography>
                {chatStep === 'end' && (
                  <Typography fontWeight={700} variant="body1">
                    Thank you
                  </Typography>
                )}
              </Breadcrumbs>
              <ChatWindow history={history} isTyping={isLoading} sendChatMessage={sendChatMessage} />
            </Stack>
          </ChatContainer>
          <PrivacyLink />
        </Grid>
      </Grid>
    </main>
  )
}

export const Head = () => <title>StreetLogic AI | Chat</title>

export default SessionPage
