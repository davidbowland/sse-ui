import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import PrivacyPage from '@pages/privacy-policy'
import PrivacyPolicy from '@components/privacy-policy'

jest.mock('@components/privacy-policy')

describe('Privacy page', () => {
  beforeAll(() => {
    jest.mocked(PrivacyPolicy).mockReturnValue(<>PrivacyPolicy</>)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    document.title = ''
  })

  it('renderes PrivacyPolicy', () => {
    render(<PrivacyPage />)

    expect(PrivacyPolicy).toHaveBeenCalledTimes(1)
  })

  it('renders title', () => {
    render(<PrivacyPage />)

    expect(document.title).toEqual('StreetLogic AI | Privacy Policy')
  })
})
