import axios from 'axios'

import {
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
  baseURL: process.env.GATSBY_SSE_API_BASE_URL,
})

// Sessions

export const createSession = async (claim: string, confidence: ConfidenceLevel): Promise<CreateSessionResult> => {
  const response = await api.post('/sessions', { claim, confidence })
  return response.data
}

export const fetchSession = async (sessionId: SessionId): Promise<Session> => {
  const response = await api.get(`/sessions/${encodeURIComponent(sessionId)}`)
  return response.data
}

// Suggest claims

export const suggestClaims = async (): Promise<SuggestedClaims> => {
  const response = await api.get('/suggest-claims')
  return response.data
}

// Validate claim

export const validateClaim = async (claim: string): Promise<ValidationResult> => {
  const response = await api.post('/validate-claim', { claim })
  return response.data
}

// LLM prompts

export const sendGuessReasonsMessage = async (sessionId: SessionId, request: LLMRequest): Promise<LLMResponse> => {
  const response = await api.post(`/sessions/${encodeURIComponent(sessionId)}/guess-reasons`, request)
  return response.data
}

export const sendProbeConfidenceMessage = async (sessionId: SessionId, request: LLMRequest): Promise<LLMResponse> => {
  const response = await api.post(`/sessions/${encodeURIComponent(sessionId)}/probe-confidence`, request)
  return response.data
}

export const sendProbeReasonsMessage = async (sessionId: SessionId, request: LLMRequest): Promise<LLMResponse> => {
  const response = await api.post(`/sessions/${encodeURIComponent(sessionId)}/probe-reasons`, request)
  return response.data
}
