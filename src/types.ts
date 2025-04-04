export { Theme } from '@mui/material/styles'

// Chatting

export type ConfidenceLevel =
  | 'absolutely disagree'
  | 'strongly disagree'
  | 'disagree'
  | 'slightly disagree'
  | 'neutral'
  | 'slightly agree'
  | 'agree'
  | 'strongly agree'
  | 'absolutely agree'

export interface ChatMessage {
  content: string
  role: 'assistant' | 'user'
}

// Claims

export interface SuggestedClaims {
  claims: string[]
}

export interface ValidationResult {
  inappropriate: boolean
  isTruthClaim: boolean
  suggestions: string[]
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
  confidence: ConfidenceLevel
  reasons: string[]
}

export interface Session {
  context: SessionContext
  expiration: number
  history: ChatMessage[]
}
