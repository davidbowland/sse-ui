import Head from 'next/head'
import Link from 'next/link'
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
          You don&apos;t have permission to view this page. If that&apos;s wrong, email us at{' '}
          <Link className="underline" href="mailto:privacy@dbowland.com">
            privacy@dbowland.com
          </Link>
          .
        </ServerErrorMessage>
      )}
    </>
  )
}

export default Forbidden
