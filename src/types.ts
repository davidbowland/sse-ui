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

// Transcription

export interface TranscriptionEvent {
  alternatives: { confidence: number; text: string }[]
  confidence: number
  isFinal: boolean
  text: string
  timestamp: number
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

// Confidence action enum

export enum ConfidenceAction {
  AUTO_SEND = 'AUTO_SEND',
  ALLOW_EDIT = 'ALLOW_EDIT',
  FORCE_TEXT_MODE = 'FORCE_TEXT_MODE',
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
