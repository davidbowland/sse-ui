import Head from 'next/head'
import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

const BadRequest = (): React.ReactNode => {
  return (
    <>
      <Head>
        <title>StreetLogic AI | 400: Bad Request</title>
      </Head>
      <ServerErrorMessage title="400: Bad Request">
        We couldn&apos;t understand your request. Check it and try again.
      </ServerErrorMessage>
    </>
  )
}

export default BadRequest
