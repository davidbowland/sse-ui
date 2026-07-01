import axios from 'axios'
import axiosRetry from 'axios-retry'

import {
  ConfidenceChangeResponse,
  ConfidenceLevel,
  CreateSessionResult,
  LLMRequest,
  LLMResponse,
  Session,
  SessionId,
  SuggestedClaims,
  ValidationResult,
} from '@types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SSE_API_BASE_URL,
  timeout: 35_000, // 35 seconds
})

// Retry once on timeout errors or network problems
axiosRetry(api, {
  retries: 1,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED'
  },
  retryDelay: axiosRetry.exponentialDelay,
})

// Confidence levels

export const fetchConfidenceLevels = async (): Promise<ConfidenceLevel[]> => {
  const response = await api.get('/confidence-levels')
  return response.data.confidenceLevels
}

export const changeConfidence = async (sessionId: SessionId, confidence: string): Promise<ConfidenceChangeResponse> => {
  const response = await api.post(`/sessions/${encodeURIComponent(sessionId)}/change-confidence`, { confidence })
  return response.data
}

// Sessions

export const createSession = async (
  claim: string,
  confidence: string,
  language: string,
): Promise<CreateSessionResult> => {
  const response = await api.post('/sessions', { claim, confidence, language })
  return response.data
}

export const fetchSession = async (sessionId: SessionId): Promise<Session> => {
  const response = await api.get(`/sessions/${encodeURIComponent(sessionId)}`)
  return response.data
}

// Suggest claims

// reCAPTCHA tokens are single-use, so the automatic retry (which would resend the identical
// token) is disabled for this request; a retried request is guaranteed to fail verification.
export const suggestClaims = async (language: string, token: string): Promise<SuggestedClaims> => {
  const response = await api.post(
    '/suggest-claims',
    { language },
    { headers: { 'x-recaptcha-token': token }, 'axios-retry': { retries: 0 } },
  )
  return response.data
}

// Validate claim

// reCAPTCHA tokens are single-use, so the automatic retry (which would resend the identical
// token) is disabled for this request; a retried request is guaranteed to fail verification.
export const validateClaim = async (claim: string, language: string, token: string): Promise<ValidationResult> => {
  const response = await api.post(
    '/validate-claim',
    { claim, language },
    { headers: { 'x-recaptcha-token': token }, 'axios-retry': { retries: 0 } },
  )
  return response.data
}

// Session cache helpers

export const mergeMessageResponse = (session: Session, response: LLMResponse): Session => ({
  ...session,
  ...response,
  overrideStep: response.overrideStep,
})

export const mergeConfidenceResponse = (session: Session, response: ConfidenceChangeResponse): Session => ({
  ...session,
  context: {
    ...session.context,
    confidence: response.confidence,
  },
  dividers: response.dividers,
  newConversation: response.newConversation,
  overrideStep: response.overrideStep,
})

// Polling

const POLL_INTERVAL_MS = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS) || 2_000

export const isStillLoading = (loadingTimeout?: number): boolean =>
  loadingTimeout !== undefined && loadingTimeout > Date.now()

export { POLL_INTERVAL_MS }

// LLM prompts

export const sendLlmMessage = async (sessionId: SessionId, path: string, request: LLMRequest): Promise<LLMResponse> => {
  const response = await api.post(`/sessions/${encodeURIComponent(sessionId)}/${encodeURIComponent(path)}`, request)
  return response.data
}
