import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

const NotFound = (): JSX.Element => {
  const display404 = typeof window !== 'undefined' && window.location.pathname.match(/^\/s\/[^/]+$/) === null

  if (display404) {
    return (
      <div className="main-content">
        <ServerErrorMessage title="404: Not Found">
          The resource you requested is unavailable. If you feel you have reached this page in error, please contact the
          webmaster.
        </ServerErrorMessage>
      </div>
    )
  }
  return <></>
}

export const Head = () => <title>StreetLogic AI | 404: Not Found</title>

export default NotFound
