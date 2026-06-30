import SessionPage from '@pages/c/[sessionId]'
import { confidenceLevels, sessionId, useSessionResults } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/router'
import React from 'react'

import ChatContainer from '@components/chat-container'
import ChatWindow from '@components/chat-window'
import { useSession } from '@hooks/useSession'

jest.mock('@components/chat-container')
jest.mock('@components/chat-window')
jest.mock('@hooks/useSession')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('Session page', () => {
  const onChangeConfidence = jest.fn()
  const sendChatMessage = jest.fn()

  beforeAll(() => {
    jest.mocked(ChatContainer).mockImplementation(({ children }) => children)
    jest.mocked(ChatWindow).mockReturnValue(<>ChatWindow</>)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    document.title = ''
    jest.mocked(useSession).mockReturnValue({ ...useSessionResults, onChangeConfidence, sendChatMessage })
    jest.mocked(useRouter).mockReturnValue({ asPath: `/c/${sessionId}` } as any)
    Object.defineProperty(window, 'location', {
      value: { pathname: `/c/${sessionId}` },
      writable: true,
    })
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
  })

  it('renders chat container', async () => {
    render(<SessionPage />)

    await waitFor(() =>
      expect(ChatContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          claim: useSessionResults.claim,
          confidenceLevels,
          initialConfidence: useSessionResults.confidence,
          onConfidenceChange: onChangeConfidence,
        }),
        undefined,
      ),
    )
  })

  it('renders claim + breadcrumbs', async () => {
    render(<SessionPage />)

    await waitFor(() =>
      expect(ChatContainer).toHaveBeenCalledWith(
        expect.objectContaining({ claim: useSessionResults.claim }),
        undefined,
      ),
    )
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Confidence')).toBeInTheDocument()
    expect(screen.getByText('Reasons')).toBeInTheDocument()
    expect(screen.getByText('Opposing reasons')).toBeInTheDocument()
    expect(screen.getByText('Conclusion')).toBeInTheDocument()
  })

  it('renders chat window', async () => {
    render(<SessionPage />)

    await waitFor(() =>
      expect(ChatWindow).toHaveBeenCalledWith(
        {
          dividers: useSessionResults.dividers,
          finished: useSessionResults.finished,
          history: useSessionResults.history,
          isTyping: useSessionResults.isLoading,
          sendChatMessage,
        },
        undefined,
      ),
    )
  })

  it('renders title', () => {
    render(<SessionPage />)

    expect(document.title).toEqual('StreetLogic AI | Chat')
  })

  it('shows error message', async () => {
    jest
      .mocked(useSession)
      .mockReturnValue({ ...useSessionResults, errorMessage: 'A big fat error', onChangeConfidence, sendChatMessage })
    render(<SessionPage />)

    await waitFor(() =>
      expect(ChatContainer).toHaveBeenCalledWith(
        expect.objectContaining({ errorMessage: 'A big fat error' }),
        undefined,
      ),
    )
  })

  it('renders nothing when sessionId is undefined', () => {
    jest.mocked(useRouter).mockReturnValue({ asPath: '/c/' } as any)
    Object.defineProperty(window, 'location', {
      value: { pathname: '/c/' },
      writable: true,
    })
    const { container } = render(<SessionPage />)

    expect(container).toBeEmptyDOMElement()
  })
})
