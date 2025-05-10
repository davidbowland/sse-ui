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

import {
  changeConfidence,
  createSession,
  fetchConfidenceLevels,
  fetchSession,
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
})
