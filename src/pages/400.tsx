import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

const BadRequest = (): JSX.Element => {
  return (
    <ServerErrorMessage title="400: Bad Request">
      Your request was malformed or otherwise could not be understood by the server. Please modify your request before
      retrying.
    </ServerErrorMessage>
  )
}

export const Head = () => <title>StreetLogic AI | 400: Bad Request</title>

export default BadRequest
