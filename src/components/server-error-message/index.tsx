import Link from 'next/link'
import React from 'react'

import { ErrorContainer, ErrorTitle } from './elements'
import PrivacyLink from '@components/privacy-link'

export interface ServerErrorProps {
  children: React.ReactNode
  title: string
}

const ServerErrorMessage = ({ children, title }: ServerErrorProps): React.ReactNode => {
  return (
    <ErrorContainer>
      <ErrorTitle>{title}</ErrorTitle>
      <div>{children}</div>
      <div>
        <Link href="/">Go home</Link>
        <PrivacyLink />
      </div>
    </ErrorContainer>
  )
}

export default ServerErrorMessage
