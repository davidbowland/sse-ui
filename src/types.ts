export { Theme } from '@mui/material/styles'

// Chatting

export type ChatRole = 'assistant' | 'user'

export interface ChatMessage {
  content: string
  role: ChatRole
}

export interface ConversationStep {
  isFinalStep?: boolean
  label: string
  path: string
  value: string
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
  language?: string
}

export interface LLMResponse {
  currentStep: string
  history: ChatMessage[]
  newConversation: boolean
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
  language: string
  possibleConfidenceLevels: ConfidenceLevel[]
}

export interface Session {
  context: SessionContext
  conversationSteps: ConversationStep[]
  currentStep?: string
  expiration: number
  history: ChatMessage[]
  newConversation: boolean
  originalConfidence: string
}
