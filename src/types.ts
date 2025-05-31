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

export interface Dividers {
  [key: number]: {
    label: string
  }
}

// Claims

export interface SuggestedClaims {
  claims: string[]
}

export interface ValidationResult {
  inappropriate: boolean
  suggestions: string[]
}

export interface ValidatedClaim {
  inappropriate: boolean
}

// Confidence levels

export interface ConfidenceLevel {
  label: string
  text: string
  value: string
}

export interface ConfidenceChangeResponse {
  confidence: string
  dividers: Dividers
  newConversation: boolean
  overrideStep: ConversationStep
}

// LLM prompts

export interface LLMRequest {
  content: string
}

export interface LLMResponse {
  currentStep: string
  dividers: Dividers
  history: ChatMessage[]
  newConversation: boolean
  overrideStep?: ConversationStep
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
  dividers: Dividers
  expiration: number
  history: ChatMessage[]
  newConversation: boolean
  originalConfidence: string
  overrideStep?: ConversationStep
  storedMessage?: ChatMessage
}
