import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'

import Index, { Head } from './index'
import PrivacyLink from '@components/privacy-link'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/privacy-link')

describe('Index page', () => {
  beforeAll(() => {
    jest.mocked(PrivacyLink).mockReturnValue(<></>)
  })

  it('renders PrivacyLink', () => {
    render(<Index />)
    expect(jest.mocked(PrivacyLink)).toHaveBeenCalledTimes(1)
  })

  it('renders Head', () => {
    render(<Head />)
    expect(document.title).toEqual('StreetLogic AI')
  })
})
