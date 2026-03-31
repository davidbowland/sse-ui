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
          The resource you requested is unavailable. If you feel you have reached this page in error, please contact the
          webmaster.
        </ServerErrorMessage>
      )}
    </>
  )
}

export default NotFound
