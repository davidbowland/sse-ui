import Grid from '@mui/material/Grid'
import React from 'react'

export interface TwoButtonsProps {
  button1: React.ReactNode
  button2: React.ReactNode
  hasExtraPadding?: boolean
}

const TwoButtons = ({ button1, button2, hasExtraPadding }: TwoButtonsProps): React.ReactNode => {
  const padding = hasExtraPadding ? { paddingRight: { sm: 'initial', xs: 6 } } : {}
  return (
    <Grid container spacing={3}>
      <Grid item md={2} order={{ xs: 1 }} sm={1} xs={0}></Grid>
      <Grid item md={3} order={{ sm: 2, xs: 4 }} sm={4} sx={padding} xs={12}>
        {button1}
      </Grid>
      <Grid item order={{ xs: 3 }} sm={2} xs={0}></Grid>
      <Grid item md={3} order={{ sm: 4, xs: 2 }} sm={4} sx={padding} xs={12}>
        {button2}
      </Grid>
      <Grid item md={2} order={{ xs: 5 }} sm={1} xs={0}></Grid>
    </Grid>
  )
}

export default TwoButtons
