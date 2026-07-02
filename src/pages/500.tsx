import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

const InternalServerError = (): React.ReactNode => {
  return (
    <>
      <Head>
        <title>StreetLogic AI | 500: Internal Server Error</title>
      </Head>
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
