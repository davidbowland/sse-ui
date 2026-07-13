import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import ServerErrorMessage from '@components/server-error-message'
import SiteHead from '@components/site-head'

const NotFound = (): React.ReactNode => {
  const [display404, setDisplay404] = useState(false)

  useEffect(() => {
    setDisplay404(window.location.pathname.match(/^\/c\/[^/]+$/) === null)
  }, [])

  return (
    <>
      <SiteHead title="StreetLogic AI | 404: Not Found" />
      {display404 && (
        <ServerErrorMessage title="404: Not Found">
          We can&apos;t find this page. If that&apos;s wrong, email us at{' '}
          <Link className="underline" href="mailto:privacy@dbowland.com">
            privacy@dbowland.com
          </Link>
          .
        </ServerErrorMessage>
      )}
    </>
  )
}

export default NotFound
