import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { confidenceChangeResponse, llmResponse, session, sessionContext, sessionId } from '@test/__mocks__'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'

import { useSession } from './useSession'
import * as sse from '@services/sse'
import { LLMRequest, LLMResponse } from '@types'

jest.mock('@services/sse', () => {
  const actual = jest.requireActual('@services/sse')
  return {
    ...actual,
    changeConfidence: jest.fn(),
    fetchSession: jest.fn(),
    sendLlmMessage: jest.fn(),
  }
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = 'TestWrapper'
  return Wrapper
}

describe('useSession', () => {
  const finishedLlmResponse: LLMResponse = { ...llmResponse, newConversation: true }
  const llmRequest: LLMRequest = {
    content: `I ${sessionContext.confidence} with the claim: ${sessionContext.claim}`,
  }
  const futureTimeout = new Date('2999-01-01T00:00:00Z').getTime()

  beforeAll(() => {
    console.error = jest.fn()
    jest.mocked(sse.fetchSession).mockResolvedValue(session)
    jest.mocked(sse.changeConfidence).mockResolvedValue(confidenceChangeResponse)
    jest.mocked(sse.sendLlmMessage).mockResolvedValue(llmResponse)
  })

  it('returns empty state when sessionId is undefined', () => {
    const { result } = renderHook(() => useSession(undefined), { wrapper: createWrapper() })

    expect(result.current.claim).toBeUndefined()
    expect(result.current.history).toEqual([])
  })

  it('fetches and applies session from the API', async () => {
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    expect(sse.fetchSession).toHaveBeenCalledWith(sessionId)
    expect(result.current.claim).toEqual(sessionContext.claim)
    expect(result.current.confidence).toEqual(sessionContext.confidence)
    expect(result.current.confidenceLevels).toEqual(session.context.possibleConfidenceLevels)
    expect(result.current.conversationSteps).toEqual(session.conversationSteps)
  })

  it('auto-sends message when newConversation is true', async () => {
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-confidence', llmRequest))
    await waitFor(() => expect(result.current.history).toEqual(llmResponse.history))
    await waitFor(() => expect(result.current.isLoading).toEqual(false))
  })

  it('proceeds through the steps', async () => {
    jest.mocked(sse).sendLlmMessage.mockResolvedValueOnce({ ...finishedLlmResponse, currentStep: 'probe reasons' })
    jest.mocked(sse).sendLlmMessage.mockResolvedValueOnce({ ...finishedLlmResponse, currentStep: 'guess reasons' })
    jest.mocked(sse).sendLlmMessage.mockResolvedValueOnce({ ...finishedLlmResponse, currentStep: 'end' })
    jest
      .mocked(sse)
      .sendLlmMessage.mockResolvedValueOnce({ ...finishedLlmResponse, currentStep: 'end', newConversation: false })
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-confidence', llmRequest))
    await waitFor(() => expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-reasons', llmRequest))
    await waitFor(() => expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'guess-reasons', llmRequest))
    await waitFor(() => expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'end-chat', llmRequest))
    await waitFor(() => expect(result.current.chatStep).toEqual('end'))
    expect(result.current.finished).toBeTruthy()
  })

  it('sends a message to the llm', async () => {
    const message = "I don't get no respect"
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.sendChatMessage(message)
    await waitFor(() =>
      expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-confidence', { content: message }),
    )
  })

  it('strips newlines from llm message', async () => {
    const message = "I don't\nget\r\nno respect"
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.sendChatMessage(message)
    await waitFor(() =>
      expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-confidence', {
        content: "I don'tgetno respect",
      }),
    )
  })

  it('optimistically adds user message to history', async () => {
    jest.mocked(sse.sendLlmMessage).mockImplementation(() => new Promise(() => {})) // never resolves
    jest.mocked(sse.fetchSession).mockResolvedValueOnce({ ...session, newConversation: false })
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.sendChatMessage('hello')
    await waitFor(() => expect(result.current.history).toContainEqual({ content: 'hello', role: 'user' }))
  })

  it('removes pending message from history on error', async () => {
    jest.mocked(sse.fetchSession).mockResolvedValueOnce({ ...session, newConversation: false })
    jest.mocked(sse.sendLlmMessage).mockRejectedValueOnce(new Error('fail'))
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.sendChatMessage('hello')
    // After error, pending message disappears from derived history
    await waitFor(() => expect(result.current.errorMessage).toBeDefined())
    expect(result.current.history).toEqual(session.history)
  })

  it('sends a confidence change', async () => {
    const message = 'I am a fish called Wanda'
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.onChangeConfidence(confidenceChangeResponse.confidence)
    await waitFor(() => expect(result.current.chatStep).toEqual('confidence changed'))
    expect(sse.changeConfidence).toHaveBeenCalledWith(sessionId, confidenceChangeResponse.confidence)

    result.current.sendChatMessage(message)
    await waitFor(() =>
      expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'new-confidence', { content: message }),
    )
  })

  it('returns an error message when fetch fails', async () => {
    jest.mocked(sse.fetchSession).mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.errorMessage).toEqual("We couldn't load your chat session."))
  })

  it('returns an error message when error changing confidence', async () => {
    jest.mocked(sse.changeConfidence).mockRejectedValueOnce(new Error('fail'))
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.confidence).toEqual('strongly agree'))
    result.current.onChangeConfidence('agree')
    await waitFor(() => expect(result.current.errorMessage).toEqual("We couldn't update your confidence level."))
  })

  it('returns an error message when error sending chat message', async () => {
    jest.mocked(sse.sendLlmMessage).mockRejectedValueOnce(new Error('fail'))
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.errorMessage).toEqual("We couldn't send your message."))
  })

  it('does not change confidence when same confidence is selected', async () => {
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.confidence).toEqual('strongly agree'))
    result.current.onChangeConfidence('strongly agree')

    expect(sse.changeConfidence).not.toHaveBeenCalled()
  })

  it('keeps isLoading true when response has newConversation true', async () => {
    jest
      .mocked(sse)
      .sendLlmMessage.mockResolvedValueOnce({ ...llmResponse, currentStep: 'probe confidence', newConversation: true })
    jest.mocked(sse).sendLlmMessage.mockResolvedValueOnce({ ...llmResponse, newConversation: false })
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.sendChatMessage('test message')

    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('starts polling when sendLlmMessage returns loadingTimeout', async () => {
    jest.mocked(sse.sendLlmMessage).mockResolvedValueOnce({ ...llmResponse, loadingTimeout: futureTimeout })
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    // isLoading should remain true while polling
    await waitFor(() => expect(result.current.isLoading).toBe(true))
  })

  it('keeps pending user message visible during polling', async () => {
    // POST returns loadingTimeout — server hasn't processed the message yet
    jest.mocked(sse.sendLlmMessage).mockResolvedValueOnce({
      ...llmResponse,
      history: session.history, // server history does NOT include user message yet
      loadingTimeout: futureTimeout,
    })
    jest.mocked(sse.fetchSession).mockResolvedValueOnce({ ...session, newConversation: false })
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    result.current.sendChatMessage('my important message')

    // The pending message should remain visible even though server history doesn't have it
    await waitFor(() =>
      expect(result.current.history).toContainEqual({ content: 'my important message', role: 'user' }),
    )
  })

  it('starts polling when changeConfidence returns loadingTimeout', async () => {
    jest
      .mocked(sse)
      .changeConfidence.mockResolvedValueOnce({ ...confidenceChangeResponse, loadingTimeout: futureTimeout })
    const { result } = renderHook(() => useSession(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.confidence).toEqual('strongly agree'))
    result.current.onChangeConfidence('disagree')
    await waitFor(() => expect(sse.changeConfidence).toHaveBeenCalledWith(sessionId, 'disagree'))
  })
})
