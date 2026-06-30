import Head from 'next/head'
import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

const InternalServerError = (): React.ReactNode => {
  return (
    <>
      <Head>
        <title>StreetLogic AI | 500: Internal Server Error</title>
      </Head>
      <ServerErrorMessage title="500: Internal Server Error">
        Something went wrong on our end. Try again — and if the problem keeps happening, please let us know.
      </ServerErrorMessage>
    </>
  )
}

export default InternalServerError
