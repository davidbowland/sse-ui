import React, { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import AddCommentIcon from '@mui/icons-material/AddComment'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { navigate } from 'gatsby'
import Paper from '@mui/material/Paper'
import SendIcon from '@mui/icons-material/Send'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { ChatMessage, ChatRole, Dividers } from '@types'

const MAX_CHAT_LENGTH = 500

export interface ChatWindowProps {
  dividers: Dividers
  finished: boolean
  history: ChatMessage[]
  isTyping: boolean
  sendChatMessage: (message: string) => void
}

const ChatWindow = ({ dividers, finished, history, isTyping, sendChatMessage }: ChatWindowProps): React.ReactNode => {
  const [chatWindowHeight, setChatWindowHeight] = useState<number>(0)
  const [message, setMessage] = useState<string>('')

  const chatWindowRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const typingIndicatorRef = useRef<HTMLDivElement>(null)

  const sendMessage = () => {
    if (!isTyping && message.length) {
      sendChatMessage(message)
      setMessage('')
    }
  }

  const generateNewClaimButton = () => {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Button
          onClick={() => navigate('/')}
          startIcon={<AddCommentIcon />}
          sx={{ maxWidth: 350, width: '100%' }}
          variant="contained"
        >
          New claim
        </Button>
      </Box>
    )
  }

  const genereateTextInput = () => {
    return (
      <Grid container>
        <Grid item sm={9} sx={{ padding: 2 }} xs={12}>
          <TextField
            label="Message"
            maxRows={4}
            multiline
            onInput={(e: any) => setMessage(e.target.value)}
            onKeyUp={(e: any) => e.key === 'Enter' && sendMessage()}
            sx={{ width: '100%' }}
            value={message.slice(0, MAX_CHAT_LENGTH)}
            variant="outlined"
          />
        </Grid>
        <Grid item sm={3} sx={{ padding: 2 }} xs={12}>
          <Button
            disabled={finished || isTyping || !message.length}
            onClick={sendMessage}
            startIcon={<SendIcon />}
            sx={{ height: '100%', width: '100%' }}
            variant="contained"
          >
            Send
          </Button>
        </Grid>
      </Grid>
    )
  }

  const scrollIntoView = () => {
    if (chatWindowRef.current) {
      setChatWindowHeight(chatWindowRef.current.clientHeight)
    }

    if (typingIndicatorRef.current) {
      typingIndicatorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    } else if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
  }

  useEffect(() => {
    setTimeout(scrollIntoView, 10)
  }, [history])

  return (
    <Stack spacing={2}>
      <Paper elevation={3}>
        <Stack
          ref={chatWindowRef}
          spacing={2}
          sx={{ minHeight: chatWindowHeight ? `${chatWindowHeight}px` : '60vh', padding: 2 }}
        >
          {history.map((message: ChatMessage, index: number) => (
            <Stack key={index} spacing={2}>
              {dividers[index] && <Divider>{dividers[index].label}</Divider>}
              <MessageDisplay role={message.role}>
                {message.content.split('\n').map((line, lineNum) => (
                  <Typography
                    key={lineNum}
                    ref={index === history.length - 1 ? messageRef : undefined}
                    sx={{ fontSize: { md: '1.0rem', sm: '0.9rem', xs: '0.8rem' } }}
                    variant="body1"
                  >
                    {line}
                  </Typography>
                ))}
              </MessageDisplay>
            </Stack>
          ))}
          {isTyping && (
            <MessageDisplay ref={typingIndicatorRef} role="assistant">
              <Skeleton sx={{ fontSize: { md: '1.0rem', sm: '0.9rem', xs: '0.8rem' } }} />
              <Skeleton sx={{ fontSize: { md: '1.0rem', sm: '0.9rem', xs: '0.8rem' } }} />
              <Skeleton sx={{ fontSize: { md: '1.0rem', sm: '0.9rem', xs: '0.8rem' } }} />
              <Skeleton
                sx={{ display: { md: 'none', xs: 'initial' }, fontSize: { md: '1.0rem', sm: '0.9rem', xs: '0.8rem' } }}
              />
              <Skeleton
                sx={{ display: { sm: 'none', xs: 'initial' }, fontSize: { md: '1.0rem', sm: '0.9rem', xs: '0.8rem' } }}
              />
            </MessageDisplay>
          )}
        </Stack>
      </Paper>
      {finished ? generateNewClaimButton() : genereateTextInput()}
    </Stack>
  )
}

interface MessageDisplayProps {
  children: React.ReactNode
  role: ChatRole
}

const MessageDisplay = forwardRef(
  ({ children, role }: MessageDisplayProps, ref: ForwardedRef<HTMLDivElement>): React.ReactNode => {
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
      <Grid container ref={ref}>
        {role === 'assistant' && <Grid item sm={3} xs={2} />}
        <Grid item sm={9} xs={10}>
          <Paper
            elevation={3}
            sx={{
              backgroundColor,
              borderRadius: 4,
              color,
              display: 'inline-block',
              padding: 2,
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Stack spacing={{ md: 0.5, xs: 0 }}>{children}</Stack>
          </Paper>
        </Grid>
        {role === 'user' && <Grid item sm={3} xs={2} />}
      </Grid>
    )
  },
)

MessageDisplay.displayName = 'MessageDisplay'

export default ChatWindow
