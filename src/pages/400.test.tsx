import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'

import BadRequest, { Head } from './400'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('400 error page', () => {
  beforeAll(() => {
    jest.mocked(ServerErrorMessage).mockReturnValue(<></>)
  })

  it('renders ServerErrorMessage', () => {
    const expectedTitle = '400: Bad Request'
    render(<BadRequest />)
    expect(jest.mocked(ServerErrorMessage)).toHaveBeenCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything(),
    )
    expect(jest.mocked(ServerErrorMessage)).toHaveBeenCalledTimes(1)
  })

  it('renders Head', () => {
    render(<Head />)
    expect(document.title).toEqual('StreetLogic AI | 400: Bad Request')
  })
})
