import { useEffect, useMemo, useState } from 'react'

import { ChatMessage, ConfidenceLevel, ConversationStep, Dividers, Session } from '@types'
import { fetchSession, sendLlmMessage } from '@services/sse'

export interface UseSessionResults {
  chatStep?: string
  claim?: string
  confidence?: string
  confidenceLevels: ConfidenceLevel[]
  conversationSteps: ConversationStep[]
  dividers: Dividers
  finished: boolean
  history: ChatMessage[]
  isLoading: boolean
  sendChatMessage: (message: string) => void
}

export const useSession = (sessionId: string): UseSessionResults => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [session, setSession] = useState<Session | undefined>(undefined)

  const currentStep = useMemo(
    () => session?.conversationSteps.find((step) => step.value === session.currentStep),
    [session],
  )

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

  const sendChatMessage = async (message: string, newConversation?: boolean): Promise<void> => {
    if (!currentStep) {
      return
    } else if (!newConversation) {
      addMessageToHistory({ content: message, role: 'user' })
    }
    setIsLoading(true)

    const response = await sendLlmMessage(sessionId, currentStep.path, {
      content: message,
    })
    setSession((prevSession) =>
      prevSession === undefined
        ? undefined
        : {
          ...prevSession,
          currentStep: response.currentStep,
          dividers: response.dividers,
          history: response.history,
          newConversation: response.newConversation,
        },
    )

    if (!response.newConversation) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.newConversation && currentStep) {
      const text = session.context.possibleConfidenceLevels.find(
        (level) => level.value === session.context.confidence,
      )?.text
      sendChatMessage(`I ${text} with the claim: ${session.context.claim}`, true)
    }
  }, [currentStep])

  useEffect(() => {
    setIsLoading(true)
    setSession(undefined)

    fetchSession(sessionId)
      .then((session) => {
        setSession(session)
        setIsLoading(session.newConversation)
      })
      .catch((error) => {
        console.error('Error fetching session', { error })
      })
  }, [sessionId])

  if (session === undefined) {
    return {
      chatStep: undefined,
      claim: undefined,
      confidence: undefined,
      confidenceLevels: [],
      conversationSteps: [],
      dividers: {},
      finished: true,
      history: [],
      isLoading,
      sendChatMessage,
    }
  }

  const finished = !!currentStep?.isFinalStep && !session.newConversation
  return {
    chatStep: currentStep?.value,
    claim: session.context.claim,
    confidence: session.context.confidence,
    confidenceLevels: session.context.possibleConfidenceLevels,
    conversationSteps: session.conversationSteps,
    dividers: session.dividers,
    finished,
    history: session.history,
    isLoading,
    sendChatMessage,
  }
}
