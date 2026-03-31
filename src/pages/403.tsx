import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import ServerErrorMessage from '@components/server-error-message'

const Forbidden = (): React.ReactNode => {
  const [display403, setDisplay403] = useState(false)

  useEffect(() => {
    setDisplay403(window.location.pathname.match(/^\/c\/[^/]+$/) === null)
  }, [])

  return (
    <>
      <Head>
        <title>StreetLogic AI | 403: Forbidden</title>
      </Head>
      {display403 && (
        <ServerErrorMessage title="403: Forbidden">
          You are not allowed to access the resource you requested. If you feel you have reached this page in error,
          please contact the webmaster.
        </ServerErrorMessage>
      )}
    </>
  )
}

export default Forbidden
