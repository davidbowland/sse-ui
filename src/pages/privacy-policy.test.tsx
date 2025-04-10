import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'

import PrivacyPage, { Head } from './privacy-policy'
import PrivacyPolicy from '@components/privacy-policy'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/privacy-policy')

describe('Privacy page', () => {
  beforeAll(() => {
    jest.mocked(PrivacyPolicy).mockReturnValue(<>PrivacyPolicy</>)
  })

  it('renderes PrivacyPolicy', () => {
    render(<PrivacyPage />)

    expect(jest.mocked(PrivacyPolicy)).toHaveBeenCalledTimes(1)
  })

  it('renders Head', () => {
    render(<Head />)

    expect(document.title).toEqual('StreetLogic AI | Privacy Policy')
  })
})
