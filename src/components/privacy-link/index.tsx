import Link from 'next/link'
import React from 'react'

import { PrivacyLinkContainer } from './elements'

const PrivacyLink = (): React.ReactNode => {
  return (
    <PrivacyLinkContainer>
      <Link href="/privacy-policy">Privacy policy</Link>
    </PrivacyLinkContainer>
  )
}

export default PrivacyLink
