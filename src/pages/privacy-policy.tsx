import Paper from '@mui/material/Paper'
import React from 'react'

import '@config/amplify'
import PrivacyPolicy from '@components/privacy-policy'

const PrivacyPage = (): JSX.Element => {
  return (
    <main>
      <Paper elevation={3} sx={{ margin: 'auto', maxWidth: '900px' }}>
        <PrivacyPolicy />
      </Paper>
    </main>
  )
}

export const Head = () => <title>StreetLogic AI | Privacy Policy</title>

export default PrivacyPage
