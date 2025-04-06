import React, { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import SendIcon from '@mui/icons-material/Send'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { ChatMessage, ChatRole } from '@types'

const MAX_CHAT_LENGTH = 500

export interface ChatWindowProps {
  history: ChatMessage[]
  isTyping: boolean
  sendChatMessage: (message: string) => void
}

const ChatWindow = ({ history, isTyping, sendChatMessage }: ChatWindowProps): React.ReactNode => {
  const [message, setMessage] = useState<string>('')

  const messageRef = useRef<HTMLDivElement>(null)

  const sendMessage = () => {
    if (!isTyping && message.length) {
      sendChatMessage(message)
      setMessage('')
    }
  }

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    }
  }, [history])

  return (
    <Stack spacing={2}>
      <Paper elevation={3} sx={{ flexGrow: 1 }}>
        <Stack padding={2} spacing={2} sx={{ maxHeight: '80vh', overflowY: 'scroll' }}>
          {history.map((message: ChatMessage, index: number) => (
            <MessageDisplay key={index} role={message.role}>
              <Typography ref={messageRef} variant='body1'>
                {message.content}
              </Typography>
            </MessageDisplay>
          ))}
          {isTyping && (
            <MessageDisplay role="assistant">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </MessageDisplay>
          )}
        </Stack>
      </Paper>
      <Grid container>
        <Grid item padding={2} sm={9} xs={12}>
          <TextField
            label="Message"
            maxRows={4}
            multiline
            onChange={(e: any) => setMessage(e.target.value)}
            onKeyUp={(e: any) => e.key === 'Enter' && sendMessage()}
            sx={{ width: '100%' }}
            value={message.slice(0, MAX_CHAT_LENGTH)}
            variant="outlined"
          />
        </Grid>
        <Grid item padding={2} sm={3} xs={12}>
          <Button disabled={isTyping || !message.length} onClick={sendMessage} startIcon={<SendIcon />} sx={{ height: '100%', width: '100%' }} variant="contained">
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
        backgroundColor: '#00BFFF',
        color: '#fff',
      }
      : {
        backgroundColor: '#E5E4E2',
        color: '#000',
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
