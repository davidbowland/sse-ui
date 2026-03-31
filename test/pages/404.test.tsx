import NotFound from '@pages/404'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import ServerErrorMessage from '@components/server-error-message'

jest.mock('@components/server-error-message')

describe('404 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<>ServerErrorMessage</>)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: '' },
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    document.title = ''
    window.location.pathname = '/an-invalid-page'
  })

  it('renders ServerErrorMessage', async () => {
    render(<NotFound />)

    await waitFor(() => expect(ServerErrorMessage).toHaveBeenCalledTimes(1))
    expect(ServerErrorMessage).toHaveBeenCalledWith(expect.objectContaining({ title: '404: Not Found' }), undefined)
  })

  it('renders nothing for session paths', async () => {
    window.location.pathname = '/c/aeiou'
    render(<NotFound />)

    await waitFor(() => expect(screen.queryByText('ServerErrorMessage')).not.toBeInTheDocument())
    expect(ServerErrorMessage).toHaveBeenCalledTimes(0)
  })

  it('renders ServerErrorMessage when the path name extends beyond sessionId', async () => {
    window.location.pathname = '/c/aeiou/y'
    render(<NotFound />)

    await waitFor(() => expect(ServerErrorMessage).toHaveBeenCalledTimes(1))
  })

  it('renders title', () => {
    render(<NotFound />)

    expect(document.title).toEqual('StreetLogic AI | 404: Not Found')
  })
})
