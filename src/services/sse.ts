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

// Confidence levels

export const fetchConfidenceLevels = async (): Promise<ConfidenceLevel[]> => {
  const response = await api.get('/confidence-levels')
  return response.data.confidenceLevels
}

// Sessions

export const createSession = async (claim: string, confidence: string, language: string): Promise<CreateSessionResult> => {
  const response = await api.post('/sessions', { claim, confidence, language })
  return response.data
}

export const fetchSession = async (sessionId: SessionId): Promise<Session> => {
  const response = await api.get(`/sessions/${encodeURIComponent(sessionId)}`)
  return response.data
}

// Suggest claims

export const suggestClaims = async (language: string): Promise<SuggestedClaims> => {
  const response = await api.post('/suggest-claims', { language })
  return response.data
}

// Validate claim

export const validateClaim = async (claim: string, language: string): Promise<ValidationResult> => {
  const response = await api.post('/validate-claim', { claim, language })
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
