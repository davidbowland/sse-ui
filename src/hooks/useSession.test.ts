import { confidenceChangeResponse, llmResponse, session, sessionContext, sessionId } from '@test/__mocks__'
import { renderHook, waitFor } from '@testing-library/react'

import { useSession } from './useSession'
import * as sse from '@services/sse'
import { LLMRequest, LLMResponse } from '@types'

jest.mock('@services/sse', () => {
  const actual = jest.requireActual('@services/sse')
  return {
    ...actual,
    changeConfidence: jest.fn(),
    sendLlmMessage: jest.fn(),
  }
})

const mockStartPolling = jest.fn()
const mockSessionQuery = {
  session: undefined as any,
  error: null as Error | null,
  startPolling: mockStartPolling,
}

jest.mock('./useSessionQuery', () => ({
  useSessionQuery: () => mockSessionQuery,
}))

describe('useSession', () => {
  const finishedLlmResponse: LLMResponse = { ...llmResponse, newConversation: true }
  const llmRequest: LLMRequest = {
    content: `I ${sessionContext.confidence} with the claim: ${sessionContext.claim}`,
  }

  beforeAll(() => {
    console.error = jest.fn()
  })

  beforeEach(() => {
    jest.mocked(sse).changeConfidence.mockResolvedValue(confidenceChangeResponse)
    jest.mocked(sse).sendLlmMessage.mockResolvedValue(llmResponse)

    mockSessionQuery.session = session
    mockSessionQuery.error = null
    mockStartPolling.mockClear()
  })

  it('returns empty state when sessionId is undefined', () => {
    mockSessionQuery.session = undefined
    const { result } = renderHook(() => useSession(undefined))

    expect(result.current.claim).toBeUndefined()
    expect(result.current.history).toEqual([])
  })

  it('applies fetched session from useSessionQuery', async () => {
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    expect(result.current.claim).toEqual(sessionContext.claim)
    expect(result.current.confidence).toEqual(sessionContext.confidence)
    expect(result.current.confidenceLevels).toEqual(session.context.possibleConfidenceLevels)
    expect(result.current.conversationSteps).toEqual(session.conversationSteps)
    expect(result.current.dividers).toEqual(session.dividers)
  })

  it('auto-sends message when newConversation is true', async () => {
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-confidence', llmRequest)
    await waitFor(() => expect(result.current.history).toEqual(llmResponse.history))
    expect(result.current.isLoading).toEqual(false)
  })

  it('proceeds through the steps', async () => {
    jest.mocked(sse).sendLlmMessage.mockResolvedValueOnce({ ...finishedLlmResponse, currentStep: 'probe reasons' })
    jest.mocked(sse).sendLlmMessage.mockResolvedValueOnce({ ...finishedLlmResponse, currentStep: 'guess reasons' })
    jest.mocked(sse).sendLlmMessage.mockResolvedValueOnce({ ...finishedLlmResponse, currentStep: 'end' })
    jest
      .mocked(sse)
      .sendLlmMessage.mockResolvedValueOnce({ ...finishedLlmResponse, currentStep: 'end', newConversation: false })
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-confidence', llmRequest))
    await waitFor(() => expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-reasons', llmRequest))
    await waitFor(() => expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'guess-reasons', llmRequest))
    await waitFor(() => expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'end-chat', llmRequest))
    await waitFor(() => expect(result.current.chatStep).toEqual('end'))
    expect(result.current.finished).toBeTruthy()
  })

  it('sends a message to the llm', async () => {
    const message = "I don't get no respect"
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.sendChatMessage(message)
    await waitFor(() =>
      expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-confidence', {
        content: message,
      }),
    )
  })

  it('strips newlines from llm message', async () => {
    const message = "I don't\nget\r\nno respect"
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.sendChatMessage(message)
    await waitFor(() =>
      expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-confidence', {
        content: "I don'tgetno respect",
      }),
    )
  })

  it('sends a confidence change', async () => {
    const message = 'I am a fish called Wanda'
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.onChangeConfidence(confidenceChangeResponse.confidence)
    await waitFor(() => expect(result.current.chatStep).toEqual('confidence changed'))
    expect(sse.changeConfidence).toHaveBeenCalledWith(sessionId, confidenceChangeResponse.confidence)

    result.current.sendChatMessage(message)
    await waitFor(() =>
      expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'new-confidence', {
        content: message,
      }),
    )
  })

  it('returns an error message when fetch fails', async () => {
    mockSessionQuery.session = undefined
    mockSessionQuery.error = new Error('Network error')
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() =>
      expect(result.current.errorMessage).toEqual('We apologize, but we were unable to load your chat session.'),
    )
  })

  it('returns an error message when error changing confidence', async () => {
    jest.mocked(sse).changeConfidence.mockRejectedValueOnce(undefined)
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.confidence).toEqual('strongly agree'))
    await result.current.onChangeConfidence('agree')
    await waitFor(() =>
      expect(result.current.errorMessage).toEqual(
        'We apologize, but there was an error changing your confidence level.',
      ),
    )
  })

  it('returns an error message when error sending chat message', async () => {
    jest.mocked(sse).sendLlmMessage.mockRejectedValueOnce(undefined)
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() =>
      expect(result.current.errorMessage).toEqual('We apologize, but there was an error sending your chat message.'),
    )
  })

  it('does not change confidence when same confidence is selected', async () => {
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.confidence).toEqual('strongly agree'))
    await result.current.onChangeConfidence('strongly agree')

    expect(sse.changeConfidence).not.toHaveBeenCalled()
  })

  it('keeps isLoading true when response has newConversation true', async () => {
    jest
      .mocked(sse)
      .sendLlmMessage.mockResolvedValueOnce({ ...llmResponse, currentStep: 'probe confidence', newConversation: true })
    jest.mocked(sse).sendLlmMessage.mockResolvedValueOnce({ ...llmResponse, newConversation: false })
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.sendChatMessage('test message')

    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('starts polling when sendLlmMessage returns loadingTimeout', async () => {
    const futureTimeout = Date.now() + 60_000
    jest.mocked(sse).sendLlmMessage.mockResolvedValueOnce({ ...llmResponse, loadingTimeout: futureTimeout })
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    await waitFor(() => expect(mockStartPolling).toHaveBeenCalled())
  })

  it('starts polling when changeConfidence returns loadingTimeout', async () => {
    const futureTimeout = Date.now() + 60_000
    jest
      .mocked(sse)
      .changeConfidence.mockResolvedValueOnce({ ...confidenceChangeResponse, loadingTimeout: futureTimeout })
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.confidence).toEqual('strongly agree'))
    await result.current.onChangeConfidence('disagree')
    await waitFor(() => expect(mockStartPolling).toHaveBeenCalled())
  })

  it('does not apply session while loadingTimeout is active', async () => {
    mockSessionQuery.session = { ...session, loadingTimeout: Date.now() + 60_000 }

    const { result } = renderHook(() => useSession(sessionId))

    // Session with active loadingTimeout should not be applied
    expect(result.current.claim).toBeUndefined()
  })

  it('applies polled session when loadingTimeout clears', async () => {
    mockSessionQuery.session = { ...session, newConversation: false, history: llmResponse.history }

    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.history).toEqual(llmResponse.history))
    expect(result.current.isLoading).toBe(false)
  })
})
