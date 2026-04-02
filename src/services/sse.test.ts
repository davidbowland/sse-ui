import {
  confidenceChangeResponse,
  confidenceLevels,
  llmRequest,
  llmResponse,
  session,
  sessionContext,
  sessionId,
  suggestedClaims,
  validationResult,
} from '@test/__mocks__'
import axiosRetry from 'axios-retry'

import {
  changeConfidence,
  createSession,
  fetchConfidenceLevels,
  fetchSession,
  isStillLoading,
  mergeConfidenceResponse,
  mergeMessageResponse,
  sendLlmMessage,
  suggestClaims,
  validateClaim,
} from './sse'

const mockGet = jest.fn()
const mockPost = jest.fn()
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: (...args: any[]) => mockGet(...args),
    post: (...args: any[]) => mockPost(...args),
  })),
}))
jest.mock('axios-retry', () => {
  const mockFn = jest.fn((_axiosInstance: any, config: any) => {
    ;(global as any).__axiosRetryConfig = config
  })
  ;(mockFn as any).isNetworkOrIdempotentRequestError = jest.fn()
  ;(mockFn as any).exponentialDelay = jest.fn()
  return mockFn
})

describe('sse', () => {
  const claim = sessionContext.claim
  const confidence = sessionContext.confidence
  const language = 'en-US'

  describe('fetchConfidenceLevels', () => {
    it('fetches confidence levels', async () => {
      mockGet.mockResolvedValueOnce({ data: { confidenceLevels } })
      const result = await fetchConfidenceLevels()

      expect(mockGet).toHaveBeenCalledWith('/confidence-levels')
      expect(result).toEqual(confidenceLevels)
    })
  })

  describe('changeConfidence', () => {
    it('changes confidence', async () => {
      const newConfidence = confidenceChangeResponse.confidence
      mockPost.mockResolvedValueOnce({ data: confidenceChangeResponse })
      const result = await changeConfidence(sessionId, newConfidence)

      expect(mockPost).toHaveBeenCalledWith(`/sessions/${sessionId}/change-confidence`, { confidence: newConfidence })
      expect(result).toEqual(confidenceChangeResponse)
    })
  })

  describe('createSession', () => {
    it('creates a session', async () => {
      mockPost.mockResolvedValueOnce({ data: { sessionId } })
      const result = await createSession(claim, confidence, language)

      expect(mockPost).toHaveBeenCalledWith('/sessions', { claim, confidence, language })
      expect(result).toEqual({ sessionId })
    })
  })

  describe('fetchSession', () => {
    it('fetches a session', async () => {
      mockGet.mockResolvedValueOnce({ data: session })
      const result = await fetchSession(sessionId)

      expect(mockGet).toHaveBeenCalledWith(`/sessions/${sessionId}`)
      expect(result).toEqual(session)
    })
  })

  describe('suggestClaims', () => {
    it('suggests claims', async () => {
      mockPost.mockResolvedValueOnce({ data: { claims: suggestedClaims } })
      const result = await suggestClaims(language)

      expect(mockPost).toHaveBeenCalledWith('/suggest-claims', { language })
      expect(result).toEqual({ claims: suggestedClaims })
    })
  })

  describe('validateClaim', () => {
    it('validates a claim', async () => {
      mockPost.mockResolvedValueOnce({ data: validationResult })
      const result = await validateClaim(claim, language)

      expect(mockPost).toHaveBeenCalledWith('/validate-claim', { claim, language })
      expect(result).toEqual(validationResult)
    })
  })

  describe('sendLlmMessage', () => {
    it('sends a guess reasons message', async () => {
      mockPost.mockResolvedValueOnce({ data: llmResponse })
      const result = await sendLlmMessage(sessionId, 'llm-message', llmRequest)

      expect(mockPost).toHaveBeenCalledWith(`/sessions/${sessionId}/llm-message`, llmRequest)
      expect(result).toEqual(llmResponse)
    })
  })

  describe('retryCondition', () => {
    let retryCondition: (error: any) => boolean

    beforeAll(() => {
      // axiosRetry is called at module load time; the config is stored in global to survive clearMocks
      retryCondition = (global as any).__axiosRetryConfig.retryCondition
    })

    it('returns true for network or idempotent request errors', () => {
      jest.mocked(axiosRetry).isNetworkOrIdempotentRequestError.mockReturnValueOnce(true)
      const error = { code: 'ENOTFOUND' } as any

      const result = retryCondition(error)

      expect(result).toBe(true)
      expect(axiosRetry.isNetworkOrIdempotentRequestError).toHaveBeenCalledWith(error)
    })

    it('returns true for ECONNABORTED errors', () => {
      jest.mocked(axiosRetry).isNetworkOrIdempotentRequestError.mockReturnValueOnce(false)
      const error = { code: 'ECONNABORTED' } as any

      const result = retryCondition(error)

      expect(result).toBe(true)
    })

    it('returns false for other errors', () => {
      jest.mocked(axiosRetry).isNetworkOrIdempotentRequestError.mockReturnValueOnce(false)
      const error = { code: 'EOTHER' } as any

      const result = retryCondition(error)

      expect(result).toBe(false)
    })
  })

  describe('isStillLoading', () => {
    it('returns true when loadingTimeout is in the future', () => {
      expect(isStillLoading(Date.now() + 60_000)).toBe(true)
    })

    it('returns false when loadingTimeout is in the past', () => {
      expect(isStillLoading(Date.now() - 1_000)).toBe(false)
    })

    it('returns false when loadingTimeout is undefined', () => {
      expect(isStillLoading(undefined)).toBe(false)
    })
  })

  describe('mergeMessageResponse', () => {
    it('merges LLM response into session', () => {
      const result = mergeMessageResponse(session, llmResponse)

      expect(result.history).toEqual(llmResponse.history)
      expect(result.currentStep).toEqual(llmResponse.currentStep)
      expect(result.dividers).toEqual(llmResponse.dividers)
      expect(result.newConversation).toEqual(llmResponse.newConversation)
      expect(result.context).toEqual(session.context)
    })
  })

  describe('mergeConfidenceResponse', () => {
    it('merges confidence response into session', () => {
      const result = mergeConfidenceResponse(session, confidenceChangeResponse)

      expect(result.context.confidence).toEqual(confidenceChangeResponse.confidence)
      expect(result.dividers).toEqual(confidenceChangeResponse.dividers)
      expect(result.newConversation).toEqual(confidenceChangeResponse.newConversation)
      expect(result.overrideStep).toEqual(confidenceChangeResponse.overrideStep)
      expect(result.context.claim).toEqual(session.context.claim)
    })
  })
})
