import React from 'react'

import ServerErrorMessage from '@components/server-error-message'
import SiteHead from '@components/site-head'

const BadRequest = (): React.ReactNode => {
  return (
    <>
      <SiteHead title="StreetLogic AI | 400: Bad Request" />
      <ServerErrorMessage title="400: Bad Request">
        We couldn&apos;t understand your request. Check it and try again.
      </ServerErrorMessage>
    </>
  )
}

export default BadRequest
