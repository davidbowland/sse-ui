import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { ConfidenceLevel } from '@types'
import TwoButtons from './two-buttons'

export interface ConfidenceStageProps {
  claim: string
  confidenceLevels: ConfidenceLevel[]
  onAcceptConfidence: (confidence: string) => void
  onBack: () => void
}

const ConfidenceStage = ({
  claim,
  confidenceLevels,
  onAcceptConfidence,
  onBack,
}: ConfidenceStageProps): React.ReactNode => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  return (
    <Stack spacing={4} sx={{ margin: 'auto', maxWidth: 'm', textAlign: 'center', width: '100%"' }}>
      <Box>
        <Typography variant="h4">What is your stance?</Typography>
      </Box>
      <Box>
        <Card sx={{ backgroundColor: '#6373fa', margin: 'auto', width: 'md' }}>
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary' }} variant="h6">
              Claim:
            </Typography>
            <Typography variant="h5">{claim}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box>
        {confidenceLevels.length === 0 ? (
          <Typography variant="body1">Error loading confidence levels. Please refresh to try again.</Typography>
        ) : (
          <List sx={{ bgcolor: 'background.paper', margin: 'auto', maxWidth: 300 }}>
            {confidenceLevels.map((level, index) => (
              <ListItem disablePadding key={index}>
                <ListItemButton onClick={() => setSelectedIndex(index)} selected={selectedIndex === index}>
                  <ListItemIcon>
                    {selectedIndex === index ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                  </ListItemIcon>
                  <ListItemText primary={level.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <TwoButtons
        button1={
          <Button onClick={() => onBack()} sx={{ width: '100%' }} variant="outlined">
            Back
          </Button>
        }
        button2={
          <Button
            onClick={() => onAcceptConfidence(confidenceLevels[selectedIndex].value)}
            sx={{ width: '100%' }}
            variant="contained"
          >
            Select
          </Button>
        }
        hasExtraPadding
      />
    </Stack>
  )
}

export default ConfidenceStage
