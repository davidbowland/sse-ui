import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import SendIcon from '@mui/icons-material/Send'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { ChatMessage, ChatRole } from '@types'

export interface ChatWindowProps {
  history: ChatMessage[]
  isTyping: boolean
  sendChatMessage: (message: string) => void
}

const ChatWindow = ({ history, isTyping, sendChatMessage }: ChatWindowProps): React.ReactNode => {
  const [message, setMessage] = useState<string>('')

  const sendMessage = () => {
    sendChatMessage(message)
    setMessage('')
  }

  return (
    <Stack spacing={2}>
      <Paper elevation={3}>
        <Stack spacing={2}>
          {history.map((message: ChatMessage, index: number) => (
            <MessageDisplay key={index} role={message.role}>
              {message.content}
            </MessageDisplay>
          ))}
          {isTyping && (
            <MessageDisplay role="assistant">
              <Skeleton />
              <Skeleton />
            </MessageDisplay>
          )}
        </Stack>
      </Paper>
      <Grid container rowSpacing={2}>
        <Grid item xs={9}>
          <TextField
            label="Message"
            onChange={(e: any) => setMessage(e.target.value)}
            sx={{ width: '100%' }}
            value={message}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={3}>
          <Button disabled={isTyping || !message.length} onClick={sendMessage} startIcon={<SendIcon />}>
            Send
          </Button>
        </Grid>
      </Grid>
    </Stack>
  )
}

interface MessageDisplayProps {
  children: React.ReactNode
  role: ChatRole
}

const MessageDisplay = ({ children, role }: MessageDisplayProps): React.ReactNode => {
  const { backgroundColor, color } =
    role === 'assistant'
      ? {
        backgroundColor: 'deepskyblue',
        color: 'white',
      }
      : {
        backgroundColor: 'platinum',
        color: 'black',
      }

  return (
    <Grid container>
      {role === 'assistant' && <Grid item xs={5} />}
      <Grid item textAlign="right" xs={7}>
        <Paper
          elevation={3}
          sx={{ backgroundColor, color, display: 'inline-block', padding: 2, textAlign: 'left', width: '100%' }}
        >
          {children}
        </Paper>
      </Grid>
      {role === 'user' && <Grid item xs={5} />}
    </Grid>
  )
}

export default ChatWindow
