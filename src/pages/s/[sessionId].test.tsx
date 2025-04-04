import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'

import SessionPage, { Head } from './[sessionId]'
import PrivacyLink from '@components/privacy-link'
import { sessionId } from '@test/__mocks__'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/privacy-link')

describe('Channel page', () => {
  beforeAll(() => {
    jest.mocked(PrivacyLink).mockReturnValue(<></>)
  })

  it('renders PrivacyLink', () => {
    render(<SessionPage params={{ sessionId }} />)
    expect(jest.mocked(PrivacyLink)).toHaveBeenCalledTimes(1)
  })

  it('renders Head', () => {
    render(<Head />)
    expect(document.title).toEqual('StreetLogic AI | Chat')
  })
})
