import Link from 'next/link'
import React from 'react'

import ServerErrorMessage from '@components/server-error-message'
import SiteHead from '@components/site-head'

const InternalServerError = (): React.ReactNode => {
  return (
    <>
      <SiteHead title="StreetLogic AI | 500: Internal Server Error" />
      <ServerErrorMessage title="500: Internal Server Error">
        Something went wrong on our end. Try again, or email{' '}
        <Link className="underline" href="mailto:privacy@dbowland.com">
          privacy@dbowland.com
        </Link>{' '}
        if it keeps happening.
      </ServerErrorMessage>
    </>
  )
}

export default InternalServerError
