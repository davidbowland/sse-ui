import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'

import InternalServerError, { Head } from './500'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('500 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<></>)
  })

  it('renders ServerErrorMessage', () => {
    const expectedTitle = '500: Internal Server Error'
    render(<InternalServerError />)
    expect(jest.mocked(ServerErrorMessage)).toHaveBeenCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything(),
    )
    expect(jest.mocked(ServerErrorMessage)).toHaveBeenCalledTimes(1)
  })

  it('renders Head', () => {
    render(<Head />)
    expect(document.title).toEqual('StreetLogic AI | 500: Internal Server Error')
  })
})
