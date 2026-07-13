import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import ServerErrorMessage from '@components/server-error-message'
import SiteHead from '@components/site-head'

const Forbidden = (): React.ReactNode => {
  const [display403, setDisplay403] = useState(false)

  useEffect(() => {
    setDisplay403(window.location.pathname.match(/^\/c\/[^/]+$/) === null)
  }, [])

  return (
    <>
      <SiteHead title="StreetLogic AI | 403: Forbidden" />
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
