import React, { useState } from 'react'
import AddCommentIcon from '@mui/icons-material/AddComment'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ChatIcon from '@mui/icons-material/Chat'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { navigate } from 'gatsby'
import PrivacyLink from '@components/privacy-link'
import Select from '@mui/material/Select'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { ConfidenceLevel } from '@types'

export interface ChatContainerProps {
  children: React.ReactNode
  confidenceLevels: ConfidenceLevel[]
  initialConfidence?: string
  onConfidenceChange: (confidence: string) => void
}

const ChatContainer = ({
  children,
  confidenceLevels,
  initialConfidence,
  onConfidenceChange,
}: ChatContainerProps): React.ReactNode => {
  const [confidence, setConfidence] = useState<string | undefined>(initialConfidence)

  const onChatConfidenceChange = (value: string) => {
    setConfidence(value)
    onConfidenceChange(value)
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar disableGutters>
          <Grid container padding={1} spacing={2}>
            <Grid item lg={2} sm={6} sx={{ textAlign: 'center' }} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                <Box>
                  <ChatIcon sx={{ mr: 1 }} />
                  <Typography
                    noWrap
                    sx={{ display: 'inline-block', fontWeight: 700, letterSpacing: '0.2rem' }}
                    variant="body1"
                  >
                    StreetLogic AI
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item lg={8} order={{ lg: 2, xs: 3 }} sx={{ textAlign: 'center' }} xs={12}>
              <FormControl sx={{ minWidth: { sm: 600, xs: '100%' } }}>
                <InputLabel id="confidence-select-label">Confidence</InputLabel>
                <Select
                  aria-label="Confidence"
                  id="confidence-select"
                  label="Confidence"
                  labelId="confidence-select-label"
                  onChange={(e) => onChatConfidenceChange(e.target.value)}
                  value={confidence}
                >
                  {confidenceLevels.map((level, index) => (
                    <MenuItem key={index} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2} order={{ lg: 3, xs: 2 }} sm={6} sx={{ paddingRight: { sm: 1, xs: 0 } }} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    onClick={() => navigate('/')}
                    startIcon={<AddCommentIcon />}
                    sx={{ maxWidth: 250, width: '100%' }}
                    variant="contained"
                  >
                    New claim
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box>{children}</Box>
      <Box sx={{ textAlign: 'center' }}>
        <PrivacyLink />
      </Box>
    </Box>
  )
}

export default ChatContainer
