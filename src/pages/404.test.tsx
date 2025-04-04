import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'

import NotFound, { Head } from './404'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('404 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<></>)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: '' },
    })
  })

  beforeEach(() => {
    window.location.pathname = '/an-invalid-page'
  })

  it('renders ServerErrorMessage', () => {
    const expectedTitle = '404: Not Found'
    render(<NotFound />)
    expect(jest.mocked(ServerErrorMessage)).toHaveBeenCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything(),
    )
    expect(jest.mocked(ServerErrorMessage)).toHaveBeenCalledTimes(1)
  })

  it('renders nothing for session paths', () => {
    window.location.pathname = '/s/aeiou'
    render(<NotFound />)
    expect(jest.mocked(ServerErrorMessage)).toHaveBeenCalledTimes(0)
  })

  it('renders ServerErrorMessage when the path name extends beyond sessionId', () => {
    window.location.pathname = '/s/aeiou/y'
    render(<NotFound />)
    expect(jest.mocked(ServerErrorMessage)).toHaveBeenCalledTimes(1)
  })

  it('renders Head', () => {
    render(<Head />)
    expect(document.title).toEqual('StreetLogic AI | 404: Not Found')
  })
})
