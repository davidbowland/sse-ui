/* eslint-disable sort-keys */
import {
  ChatMessage,
  ConfidenceChangeResponse,
  ConversationStep,
  Dividers,
  LLMRequest,
  LLMResponse,
  Session,
  SessionContext,
  SessionId,
} from '@types'

// Chat

export const assistantMessage: ChatMessage = { content: 'Whatchu mean?', role: 'assistant' }
export const newAssistantMessage: ChatMessage = { content: 'Why do you think that?', role: 'assistant' }
export const userMessage: ChatMessage = { content: 'I think I saw a cat', role: 'user' }

export const conversationSteps: ConversationStep[] = [
  { label: 'Introduction', path: 'start-chat', value: 'start' },
  { label: 'Confidence', path: 'probe-confidence', value: 'probe confidence' },
  { label: 'Reasons', path: 'probe-reasons', value: 'probe reasons' },
  { label: 'Opposing reasons', path: 'guess-reasons', value: 'guess reasons' },
  { isFinalStep: true, label: 'Conclusion', path: 'end-chat', value: 'end' },
]

export const dividers: Dividers = { 0: { label: 'Introduction' } }

// Claims

export const suggestedClaims: string[] = [
  'Military intervention causes more harm than good.',
  'The world would be more peaceful with less US military intervention.',
  'US military spending should be reduced.',
  'The US should only intervene militarily when directly attacked.',
  'US foreign policy should focus on diplomacy rather than military action.',
]

export const validationResult = {
  inappropriate: false,
  suggestions: suggestedClaims,
}

// Confidence levels

export const confidenceLevels = [
  { label: 'Strongly agree', text: 'strongly agree', value: 'strongly agree' },
  { label: 'Agree', text: 'agree', value: 'agree' },
  { label: 'Slightly agree', text: 'slightly agree', value: 'slightly agree' },
  { label: 'Neutral', text: 'neither agree nor disagree', value: 'neutral' },
  { label: 'Slightly disagree', text: 'slightly disagree', value: 'slightly disagree' },
  { label: 'Disagree', text: 'disagree', value: 'disagree' },
  { label: 'Strongly disagree', text: 'strongly disagree', value: 'strongly disagree' },
]

export const confidenceChangeResponse: ConfidenceChangeResponse = {
  confidence: 'disagree',
  dividers,
  newConversation: false,
  overrideStep: { label: 'Confidence change', path: 'new-confidence', value: 'confidence changed' },
}

// LLM prompts

export const llmRequest: LLMRequest = {
  content: 'Because you smell',
}

export const llmResponse: LLMResponse = {
  currentStep: 'probe confidence',
  dividers,
  history: [assistantMessage, userMessage, newAssistantMessage],
  newConversation: false,
}

// Sessions

export const sessionId: SessionId = '8675309'

export const sessionContext: SessionContext = {
  claim: 'The Holy Roman Empire was neither Holy nor Roman nor an Empire.',
  confidence: 'strongly agree',
  language: 'en-US',
  generatedReasons: ["They're animatronic"],
  possibleConfidenceLevels: confidenceLevels,
}

export const session: Session = {
  context: sessionContext,
  conversationSteps,
  currentStep: 'probe confidence',
  dividers,
  expiration: 1743407368,
  history: [userMessage, assistantMessage],
  newConversation: true,
  originalConfidence: 'strongly agree',
}

export const useSessionResults = {
  chatStep: session.currentStep,
  claim: sessionContext.claim,
  confidence: sessionContext.confidence,
  confidenceLevels,
  conversationSteps,
  dividers,
  finished: false,
  history: [userMessage, assistantMessage],
  isLoading: false,
}
