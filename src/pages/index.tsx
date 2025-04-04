import Grid from '@mui/material/Grid'
import React from 'react'

import PrivacyLink from '@components/privacy-link'

const Index = (): JSX.Element => {
  return (
    <main style={{ minHeight: '90vh' }}>
      <Grid container sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item sx={{ m: 'auto', maxWidth: 1200, width: '100%' }}>
          <PrivacyLink />
        </Grid>
      </Grid>
    </main>
  )
}

export const Head = () => <title>StreetLogic AI</title>

export default Index
