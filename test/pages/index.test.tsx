import Index from '@pages/index'
import { sessionId } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import ClaimPrompt from '@components/claim-prompt'
import PrivacyLink from '@components/privacy-link'
import * as sse from '@services/sse'

jest.mock('@components/claim-prompt')
jest.mock('@components/privacy-link')
jest.mock('@services/sse')
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}))

describe('Index page', () => {
  const mockOnClaimSelect = jest.fn()

  beforeAll(() => {
    jest.mocked(ClaimPrompt).mockImplementation(({ onClaimSelect }) => {
      mockOnClaimSelect.mockImplementation(onClaimSelect)
      return <>ClaimPrompt</>
    })
    jest.mocked(PrivacyLink).mockReturnValue(<>PrivacyLink</>)
    jest.mocked(sse).createSession.mockResolvedValue({ sessionId })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    document.title = ''
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { search: '' },
    })
  })

  it('renders PrivacyLink', () => {
    render(<Index />)

    expect(PrivacyLink).toHaveBeenCalledTimes(1)
  })

  it('renders ClaimPrompt', () => {
    render(<Index />)

    expect(ClaimPrompt).toHaveBeenCalledTimes(1)
  })

  it('sends passed claim to ClaimPrompt', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { search: '?claim=Pickles%20are%20lazy%20cucumbers' },
    })

    render(<Index />)

    expect(ClaimPrompt).toHaveBeenLastCalledWith(
      expect.objectContaining({ initialClaim: 'Pickles are lazy cucumbers' }),
      undefined,
    )
  })

  it('invokes createSession on new session', async () => {
    const claim = 'mah claim'
    const confidence = 'strongly agree'
    const language = 'es-PA'
    render(<Index />)
    await mockOnClaimSelect(claim, confidence, language)

    expect(sse.createSession).toHaveBeenCalledWith(claim, confidence, language)
  })

  it('renders title', () => {
    render(<Index />)

    expect(document.title).toEqual('StreetLogic AI')
  })
})
