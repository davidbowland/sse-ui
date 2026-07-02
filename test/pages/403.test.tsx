import Forbidden from '@pages/403'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

jest.mock('@components/server-error-message')

describe('403 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<>ServerErrorMessage</>)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: '' },
    })
  })

  const setup = (pathname = '/an-invalid-page') => {
    document.title = ''
    window.location.pathname = pathname
  }

  it('renders ServerErrorMessage', async () => {
    setup()
    render(<Forbidden />)

    await waitFor(() => expect(ServerErrorMessage).toHaveBeenCalledTimes(1))
    expect(ServerErrorMessage).toHaveBeenCalledWith(expect.objectContaining({ title: '403: Forbidden' }), undefined)
  })

  it('renders nothing for session paths', async () => {
    setup('/c/aeiou')
    render(<Forbidden />)

    await waitFor(() => expect(screen.queryByText('ServerErrorMessage')).not.toBeInTheDocument())
    expect(ServerErrorMessage).toHaveBeenCalledTimes(0)
  })

  it('renders ServerErrorMessage when the path name extends beyond sessionId', async () => {
    setup('/c/aeiou/y')
    render(<Forbidden />)

    await waitFor(() => expect(ServerErrorMessage).toHaveBeenCalledTimes(1))
  })

  it('renders title', () => {
    setup()
    render(<Forbidden />)

    expect(document.title).toEqual('StreetLogic AI | 403: Forbidden')
  })
})
