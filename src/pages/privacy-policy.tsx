import Head from 'next/head'
import React from 'react'

import PrivacyPolicy from '@components/privacy-policy'

const PrivacyPage = (): React.ReactNode => {
  return (
    <>
      <Head>
        <title>StreetLogic AI | Privacy Policy</title>
      </Head>
      <PrivacyPolicy />
    </>
  )
}

export default PrivacyPage
