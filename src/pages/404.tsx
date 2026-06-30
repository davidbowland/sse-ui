import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import ServerErrorMessage from '@components/server-error-message'

const NotFound = (): React.ReactNode => {
  const [display404, setDisplay404] = useState(false)

  useEffect(() => {
    setDisplay404(window.location.pathname.match(/^\/c\/[^/]+$/) === null)
  }, [])

  return (
    <>
      <Head>
        <title>StreetLogic AI | 404: Not Found</title>
      </Head>
      {display404 && (
        <ServerErrorMessage title="404: Not Found">
          We can&apos;t find this page. If you think something&apos;s wrong, please let us know.
        </ServerErrorMessage>
      )}
    </>
  )
}

export default NotFound
