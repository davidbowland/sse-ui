import React from 'react'

import PrivacyPolicy from '@components/privacy-policy'
import SiteHead from '@components/site-head'

const PrivacyPage = (): React.ReactNode => {
  return (
    <>
      <SiteHead title="StreetLogic AI | Privacy Policy" />
      <PrivacyPolicy />
    </>
  )
}

export default PrivacyPage
