import {
  createSession,
  sendGuessReasonsMessage,
  sendProbeConfidenceMessage,
  sendProbeReasonsMessage,
  suggestClaims,
  validateClaim,
} from './sse'
import { llmRequest, llmResponse, sessionContext, sessionId, suggestedClaims, validationResult } from '@test/__mocks__'

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

  describe('createSession', () => {
    it('should create a session', async () => {
      mockPost.mockResolvedValueOnce({ data: { sessionId } })
      const result = await createSession(claim, confidence)

      expect(mockPost).toHaveBeenCalledWith('/sessions', { claim, confidence })
      expect(result).toEqual({ sessionId })
    })
  })

  describe('suggestClaims', () => {
    it('should suggest claims', async () => {
      mockGet.mockResolvedValueOnce({ data: { claims: suggestedClaims } })
      const result = await suggestClaims()

      expect(mockGet).toHaveBeenCalledWith('/suggest-claims')
      expect(result).toEqual({ claims: suggestedClaims })
    })
  })

  describe('validateClaim', () => {
    it('should validate a claim', async () => {
      mockPost.mockResolvedValueOnce({ data: validationResult })
      const result = await validateClaim(claim)

      expect(mockPost).toHaveBeenCalledWith('/validate-claim', { claim })
      expect(result).toEqual(validationResult)
    })
  })

  describe('sendGuessReasonsMessage', () => {
    it('should send a guess reasons message', async () => {
      mockPost.mockResolvedValueOnce({ data: llmResponse })
      const result = await sendGuessReasonsMessage(sessionId, llmRequest)

      expect(mockPost).toHaveBeenCalledWith(`/sessions/${sessionId}/guess-reasons`, llmRequest)
      expect(result).toEqual(llmResponse)
    })
  })

  describe('sendProbeConfidenceMessage', () => {
    it('should send a guess reasons message', async () => {
      mockPost.mockResolvedValueOnce({ data: llmResponse })
      const result = await sendProbeConfidenceMessage(sessionId, llmRequest)

      expect(mockPost).toHaveBeenCalledWith(`/sessions/${sessionId}/probe-confidence`, llmRequest)
      expect(result).toEqual(llmResponse)
    })
  })

  describe('sendProbeReasonsMessage', () => {
    it('should send a guess reasons message', async () => {
      mockPost.mockResolvedValueOnce({ data: llmResponse })
      const result = await sendProbeReasonsMessage(sessionId, llmRequest)

      expect(mockPost).toHaveBeenCalledWith(`/sessions/${sessionId}/probe-reasons`, llmRequest)
      expect(result).toEqual(llmResponse)
    })
  })
})
