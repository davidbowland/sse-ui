import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import TwoButtons from './two-buttons'

export interface SelectingStageProps {
  initialIndex: number
  onAcceptClaim: (claim: string) => void
  onBack: () => void
  suggestedClaims: string[]
}

const SelectingStage = ({
  initialIndex,
  onAcceptClaim,
  onBack,
  suggestedClaims,
}: SelectingStageProps): React.ReactNode => {
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex)

  useEffect(() => {
    setSelectedIndex(initialIndex)
  }, [suggestedClaims])

  return (
    <Stack spacing={2} sx={{ margin: 'auto', maxWidth: 'm', textAlign: 'center', width: '100%"' }}>
      <Box>
        <Typography variant="h4">Select a claim</Typography>
      </Box>
      <Box>
        <List sx={{ bgcolor: 'background.paper', margin: 'auto', maxWidth: 800 }}>
          {suggestedClaims.map((claim, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton onClick={() => setSelectedIndex(index)} selected={selectedIndex === index}>
                <ListItemIcon>
                  {selectedIndex === index ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                </ListItemIcon>
                <ListItemText primary={claim} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <TwoButtons
        button1={
          <Button onClick={() => onBack()} sx={{ width: '100%' }} variant="outlined">
            Back
          </Button>
        }
        button2={
          <Button
            onClick={() => onAcceptClaim(suggestedClaims[selectedIndex])}
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

export default SelectingStage
