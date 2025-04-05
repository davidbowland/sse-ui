import { renderHook, waitFor } from '@testing-library/react'

import * as sse from '@services/sse'
import { LLMRequest, LLMResponse } from '@types'
import { llmResponse, session, sessionContext, sessionId } from '@test/__mocks__'
import { useSession } from './useSession'

jest.mock('@services/sse')

describe('useSession', () => {
  const finishedLlmResponse: LLMResponse = { ...llmResponse, finished: true }
  const newConversationRequest: LLMRequest = {
    content: `I ${sessionContext.confidence} with the claim: ${sessionContext.claim}`,
    newConversation: true,
  }

  beforeAll(() => {
    jest.mocked(sse).createSession.mockResolvedValue({ sessionId })
    jest.mocked(sse).fetchSession.mockResolvedValue(session)
    jest.mocked(sse).sendGuessReasonsMessage.mockResolvedValue(llmResponse)
    jest.mocked(sse).sendProbeConfidenceMessage.mockResolvedValue(llmResponse)
    jest.mocked(sse).sendProbeReasonsMessage.mockResolvedValue(llmResponse)
  })

  it('fetches a session by ID and returns it', async () => {
    const { result } = renderHook(() => useSession(sessionId))

    expect(sse.fetchSession).toHaveBeenCalledWith(sessionId)
    await waitFor(() => expect(result.current.chatStep).toEqual('probe-confidence'))
    expect(sse.sendProbeConfidenceMessage).toHaveBeenCalledWith(sessionId, newConversationRequest)
    expect(result.current.claim).toEqual(sessionContext.claim)
    expect(result.current.confidence).toEqual(sessionContext.confidence)
    expect(result.current.history).toEqual(llmResponse.history)
    expect(result.current.isLoading).toEqual(false)
  })

  it('proceeds through the steps', async () => {
    jest.mocked(sse).sendGuessReasonsMessage.mockResolvedValueOnce(finishedLlmResponse)
    jest.mocked(sse).sendProbeConfidenceMessage.mockResolvedValueOnce(finishedLlmResponse)
    jest.mocked(sse).sendProbeReasonsMessage.mockResolvedValueOnce(finishedLlmResponse)
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(sse.sendProbeConfidenceMessage).toHaveBeenCalledWith(sessionId, newConversationRequest))
    await waitFor(() => expect(sse.sendProbeReasonsMessage).toHaveBeenCalledWith(sessionId, newConversationRequest))
    await waitFor(() => expect(sse.sendGuessReasonsMessage).toHaveBeenCalledWith(sessionId, newConversationRequest))
    expect(sse.fetchSession).toHaveBeenCalledWith(sessionId)
    await waitFor(() => expect(result.current.chatStep).toEqual('end'))
  })

  it('sends a message to the llm', async () => {
    const message = "I don't get no respect"
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => expect(result.current.chatStep).toEqual('probe-confidence'))
    result.current.sendChatMessage(message)
    await waitFor(() => expect(sse.sendProbeConfidenceMessage).toHaveBeenCalledWith(sessionId, { content: message }))
  })
})
