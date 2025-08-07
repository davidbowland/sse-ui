import { confidenceChangeResponse, llmResponse, session, sessionContext, sessionId } from '@test/__mocks__'
import { renderHook, waitFor } from '@testing-library/react'

import { useSession } from './useSession'
import * as sse from '@services/sse'
import { LLMRequest, LLMResponse } from '@types'

jest.mock('@services/sse')

describe('useSession', () => {
  const finishedLlmResponse: LLMResponse = { ...llmResponse, newConversation: true }
  const llmRequest: LLMRequest = {
    content: `I ${sessionContext.confidence} with the claim: ${sessionContext.claim}`,
  }

  beforeAll(() => {
    jest.mocked(sse).changeConfidence.mockResolvedValue(confidenceChangeResponse)
    jest.mocked(sse).createSession.mockResolvedValue({ sessionId })
    jest.mocked(sse).fetchSession.mockResolvedValue(session)
    jest.mocked(sse).sendLlmMessage.mockResolvedValue(llmResponse)

    console.error = jest.fn()
  })

  it('fetches a session by ID and returns it', async () => {
    const { result } = renderHook(() => useSession(sessionId))

    expect(sse.fetchSession).toHaveBeenCalledWith(sessionId)
    await waitFor(() => expect(result.current.chatStep).toEqual('probe confidence'))
    expect(sse.sendLlmMessage).toHaveBeenCalledWith(sessionId, 'probe-confidence', llmRequest)
    expect(result.current.claim).toEqual(sessionContext.claim)
    expect(result.current.confidence).toEqual(sessionContext.confidence)
    expect(result.current.confidenceLevels).toEqual(session.context.possibleConfidenceLevels)
    expect(result.current.conversationSteps).toEqual(session.conversationSteps)
    expect(result.current.dividers).toEqual(session.dividers)
    expect(result.current.finished).toBeFalsy()
    expect(result.current.history).toEqual(llmResponse.history)
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
    expect(sse.fetchSession).toHaveBeenCalledWith(sessionId)
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

  it('returns an error message when error loading chat session', async () => {
    jest.mocked(sse).fetchSession.mockRejectedValueOnce(undefined)
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() =>
      expect(result.current.errorMessage).toEqual('We apologize, but we were unable to load your chat session.'),
    )
  })

  it('returns an error message when error changing confidence', async () => {
    jest.mocked(sse).changeConfidence.mockRejectedValueOnce(undefined)
    const { result } = renderHook(() => useSession(sessionId))

    await waitFor(() => result.current.confidence === 'strongly agree')
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
})
