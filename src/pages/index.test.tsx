import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'

import * as sse from '@services/sse'
import Index, { Head } from './index'
import ClaimPrompt from '@components/claim-prompt'
import PrivacyLink from '@components/privacy-link'
import { sessionId } from '@test/__mocks__'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/claim-prompt')
jest.mock('@components/privacy-link')
jest.mock('@services/sse')
jest.mock('gatsby')

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

    expect(ClaimPrompt).toHaveBeenCalledTimes(1)
    expect(ClaimPrompt).toHaveBeenCalledWith(
      expect.objectContaining({ initialClaim: 'Pickles are lazy cucumbers' }),
      {},
    )
  })

  it('invokes createSession on new session.', async () => {
    const claim = 'mah claim'
    const confidence = 'strongly agree'
    const language = 'es-PA'
    render(<Index />)
    mockOnClaimSelect(claim, confidence, language)

    expect(sse.createSession).toHaveBeenCalledWith(claim, confidence, language)
  })

  it('renders Head', () => {
    render(<Head />)
    expect(document.title).toEqual('StreetLogic AI')
  })
})
