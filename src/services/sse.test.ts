import {
  createSession,
  fetchSession,
  sendGuessReasonsMessage,
  sendProbeConfidenceMessage,
  sendProbeReasonsMessage,
  suggestClaims,
  validateClaim,
} from './sse'
import {
  llmRequest,
  llmResponse,
  session,
  sessionContext,
  sessionId,
  suggestedClaims,
  validationResult,
} from '@test/__mocks__'

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
    it('creates a session', async () => {
      mockPost.mockResolvedValueOnce({ data: { sessionId } })
      const result = await createSession(claim, confidence)

      expect(mockPost).toHaveBeenCalledWith('/sessions', { claim, confidence })
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
      const result = await suggestClaims()

      expect(mockPost).toHaveBeenCalledWith('/suggest-claims')
      expect(result).toEqual({ claims: suggestedClaims })
    })
  })

  describe('validateClaim', () => {
    it('validates a claim', async () => {
      mockPost.mockResolvedValueOnce({ data: validationResult })
      const result = await validateClaim(claim)

      expect(mockPost).toHaveBeenCalledWith('/validate-claim', { claim })
      expect(result).toEqual(validationResult)
    })
  })

  describe('sendGuessReasonsMessage', () => {
    it('sends a guess reasons message', async () => {
      mockPost.mockResolvedValueOnce({ data: llmResponse })
      const result = await sendGuessReasonsMessage(sessionId, llmRequest)

      expect(mockPost).toHaveBeenCalledWith(`/sessions/${sessionId}/guess-reasons`, llmRequest)
      expect(result).toEqual(llmResponse)
    })
  })

  describe('sendProbeConfidenceMessage', () => {
    it('sends a guess reasons message', async () => {
      mockPost.mockResolvedValueOnce({ data: llmResponse })
      const result = await sendProbeConfidenceMessage(sessionId, llmRequest)

      expect(mockPost).toHaveBeenCalledWith(`/sessions/${sessionId}/probe-confidence`, llmRequest)
      expect(result).toEqual(llmResponse)
    })
  })

  describe('sendProbeReasonsMessage', () => {
    it('sends a guess reasons message', async () => {
      mockPost.mockResolvedValueOnce({ data: llmResponse })
      const result = await sendProbeReasonsMessage(sessionId, llmRequest)

      expect(mockPost).toHaveBeenCalledWith(`/sessions/${sessionId}/probe-reasons`, llmRequest)
      expect(result).toEqual(llmResponse)
    })
  })
})
