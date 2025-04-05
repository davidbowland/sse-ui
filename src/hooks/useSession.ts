import { useEffect, useState } from 'react'

import { ChatMessage, ChatStep, ConfidenceLevel, LLMResponse, Session } from '@types'
import {
  fetchSession,
  sendGuessReasonsMessage,
  sendProbeConfidenceMessage,
  sendProbeReasonsMessage,
} from '@services/sse'

const CHAT_STEP_HANDLERS = {
  end: () => ({}) as LLMResponse,
  'guess-reasons': sendGuessReasonsMessage,
  'probe-confidence': sendProbeConfidenceMessage,
  'probe-reasons': sendProbeReasonsMessage,
  start: () => ({}) as LLMResponse,
}

export interface UseSessionResults {
  chatStep: ChatStep
  claim?: string
  confidence?: ConfidenceLevel
  history: ChatMessage[]
  isLoading: boolean
  sendChatMessage: (message: string) => void
}

export const useSession = (sessionId: string): UseSessionResults => {
  const [chatStep, setChatStep] = useState<ChatStep>('start')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [session, setSession] = useState<Session | undefined>(undefined)

  const addMessageToHistory = (message: ChatMessage): void => {
    setSession((prevSession) => {
      if (prevSession === undefined) {
        return undefined
      }

      return {
        ...prevSession,
        history: [...prevSession.history, message],
      }
    })
  }

  const nextChatStep = () => {
    console.log('nextChatStep', { chatStep })
    if (chatStep === 'start') {
      setChatStep('probe-confidence')
    } else if (chatStep === 'probe-confidence') {
      setChatStep('probe-reasons')
    } else if (chatStep === 'probe-reasons') {
      setChatStep('guess-reasons')
    } else if (chatStep === 'guess-reasons') {
      setChatStep('end')
    }
  }

  const sendToLlm = CHAT_STEP_HANDLERS[chatStep]

  const sendChatMessage = async (message: string, newConversation?: boolean): Promise<void> => {
    if (!newConversation) {
      addMessageToHistory({ content: message, role: 'user' })
    }
    setIsLoading(true)

    const response = await sendToLlm(sessionId, { content: message, newConversation })
    setSession((prevSession) => (prevSession === undefined ? undefined : { ...prevSession, history: response.history }))
    console.log('sendChatMessage', { chatStep, context: session?.context, response, session })
    if (response.finished) {
      nextChatStep()
    } else {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('chatStep', { chatStep, context: session?.context, session })
    if (session) {
      if (chatStep === 'probe-confidence' || chatStep === 'probe-reasons' || chatStep === 'guess-reasons') {
        sendChatMessage(`I ${session.context.confidence} with the claim: ${session.context.claim}`, true)
      } else if (chatStep === 'start') {
        nextChatStep()
      }
    }
  }, [chatStep])

  useEffect(() => {
    setChatStep('end')
    setIsLoading(true)
    setSession(undefined)

    fetchSession(sessionId).then((session) => {
      setSession(session)
      setChatStep('start')
    })
  }, [sessionId])

  if (session === undefined) {
    return {
      chatStep,
      claim: undefined,
      confidence: undefined,
      history: [],
      isLoading,
      sendChatMessage,
    }
  }

  return {
    chatStep,
    claim: session.context.claim,
    confidence: session.context.confidence,
    history: session.history,
    isLoading,
    sendChatMessage,
  }
}
