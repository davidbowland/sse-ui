import React, { useState } from 'react'
import AddCommentIcon from '@mui/icons-material/AddComment'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ChatIcon from '@mui/icons-material/Chat'
import { navigate } from 'gatsby'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { confidenceLevels, getLabelFromConfidence } from '@config/confidence-levels'
import { ConfidenceLevel } from '@types'

export interface ChatContainerProps {
  children: React.ReactNode
  initialConfidence?: ConfidenceLevel
  onConfidenceChange: (confidence: ConfidenceLevel) => void
}

const ChatContainer = ({ children, initialConfidence, onConfidenceChange }: ChatContainerProps): React.ReactNode => {
  const [confidence, setConfidence] = useState<ConfidenceLevel | undefined>(initialConfidence)

  const onToggleButtonChange = (e: any, value: ConfidenceLevel) => {
    setConfidence(value)
    onConfidenceChange(value)
  }

  const newClaim = () => {
    navigate('/')
  }

  return (
    <Stack spacing={2}>
      <AppBar position="static">
        <Toolbar disableGutters>
          <ChatIcon sx={{ display: { md: 'flex', xs: 'none' }, mr: 1 }} />
          <Typography noWrap sx={{ display: 'flex', fontWeight: 700, letterSpacing: '0.2rem' }} variant="h6">
            StreetLogic AI
          </Typography>
          <Box flexGrow={1}>
            <ToggleButtonGroup
              aria-label="Confidence level"
              exclusive
              onChange={onToggleButtonChange}
              value={confidence}
            >
              {confidenceLevels.map((level, index) => (
                <ToggleButton aria-label={getLabelFromConfidence(level)} key={index} value={level}>
                  {getLabelFromConfidence(level)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Button onClick={newClaim} startIcon={<AddCommentIcon />} sx={{ display: 'flex' }}>
            New claim
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </Stack>
  )
}

export default ChatContainer
