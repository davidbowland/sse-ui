import { confidenceLevels, sessionId, useSessionResults } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import SessionPage, { Head } from './[sessionId]'
import ChatContainer from '@components/chat-container'
import ChatWindow from '@components/chat-window'
import PrivacyLink from '@components/privacy-link'
import { useSession } from '@hooks/useSession'

jest.mock('@components/chat-container')
jest.mock('@components/chat-window')
jest.mock('@components/privacy-link')
jest.mock('@hooks/useSession')

describe('Channel page', () => {
  const onChangeConfidence = jest.fn()
  const sendChatMessage = jest.fn()

  beforeAll(() => {
    jest.mocked(ChatContainer).mockImplementation(({ children }) => children)
    jest.mocked(ChatWindow).mockReturnValue(<>ChatWindow</>)
    jest.mocked(PrivacyLink).mockReturnValue(<>PrivacyLink</>)
  })

  beforeEach(() => {
    jest.mocked(useSession).mockReturnValue({ ...useSessionResults, onChangeConfidence, sendChatMessage })
  })

  it('renders chat container', async () => {
    render(<SessionPage params={{ sessionId }} />)

    await waitFor(() =>
      expect(ChatContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          confidenceLevels,
          initialConfidence: useSessionResults.confidence,
          onConfidenceChange: onChangeConfidence,
        }),
        {},
      ),
    )
  })

  it('renders claim + breadcrumbs', async () => {
    render(<SessionPage params={{ sessionId }} />)

    expect(await screen.findByText(useSessionResults.claim)).toBeInTheDocument()
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Confidence')).toBeInTheDocument()
    expect(screen.getByText('Reasons')).toBeInTheDocument()
    expect(screen.getByText('Opposing reasons')).toBeInTheDocument()
    expect(screen.getByText('Conclusion')).toBeInTheDocument()
  })

  it('renders chat window', () => {
    render(<SessionPage params={{ sessionId }} />)

    expect(ChatWindow).toHaveBeenCalledWith(
      {
        dividers: useSessionResults.dividers,
        finished: useSessionResults.finished,
        history: useSessionResults.history,
        isTyping: useSessionResults.isLoading,
        sendChatMessage,
      },
      {},
    )
  })

  it('renders PrivacyLink', () => {
    render(<SessionPage params={{ sessionId }} />)

    expect(PrivacyLink).toHaveBeenCalledTimes(0)
  })

  it('renders Head', () => {
    render(<Head />)

    expect(document.title).toEqual('StreetLogic AI | Chat')
  })

  it('shows error message', () => {
    jest
      .mocked(useSession)
      .mockReturnValue({ ...useSessionResults, errorMessage: 'A big fat error', onChangeConfidence, sendChatMessage })
    render(<SessionPage params={{ sessionId }} />)

    expect(screen.getByText(/A big fat error/)).toBeInTheDocument()
  })
})
