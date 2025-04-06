export { Theme } from '@mui/material/styles'

// Chatting

export type ChatRole = 'assistant' | 'user'

export interface ChatMessage {
  content: string
  role: ChatRole
}

export type ChatStep = 'start' | 'probe-confidence' | 'probe-reasons' | 'guess-reasons' | 'end'

// Claims

export interface SuggestedClaims {
  claims: string[]
}

export interface ValidationResult {
  inappropriate: boolean
  isTruthClaim: boolean
  suggestions: string[]
}

export interface ValidatedClaim {
  inappropriate: boolean
  isTruthClaim: boolean
}

// Confidence levels

export interface ConfidenceLevel {
  label: string
  text: string
  value: string
}

// LLM prompts

export interface LLMRequest {
  content: string
  newConversation?: boolean
}

export interface LLMResponse {
  finished: boolean
  history: ChatMessage[]
}

// Sessions

export type SessionId = string

export interface CreateSessionResult {
  sessionId: SessionId
}

export interface SessionContext {
  claim: string
  confidence: string
  generatedReasons: string[]
  possibleConfidenceLevels: ConfidenceLevel[]
}

export interface Session {
  context: SessionContext
  expiration: number
  history: ChatMessage[]
}
