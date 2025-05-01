import { useEffect, useMemo, useState } from 'react'

import { changeConfidence, fetchSession, sendLlmMessage } from '@services/sse'
import { ChatMessage, ConfidenceLevel, ConversationStep, Dividers, Session } from '@types'

export interface UseSessionResults {
  chatStep?: string
  claim?: string
  confidence?: string
  confidenceLevels: ConfidenceLevel[]
  conversationSteps: ConversationStep[]
  dividers: Dividers
  errorMessage?: string
  finished: boolean
  history: ChatMessage[]
  isLoading: boolean
  onChangeConfidence: (confidence: string) => void
  sendChatMessage: (message: string) => void
}

export const useSession = (sessionId: string): UseSessionResults => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [session, setSession] = useState<Session | undefined>(undefined)

  const currentStep = useMemo(
    () => session?.overrideStep ?? session?.conversationSteps.find((step) => step.value === session.currentStep),
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
    const sanitizedMessage = message.trim().replace(/\r|\n/g, '')
    if (!currentStep) {
      return
    } else if (!newConversation) {
      addMessageToHistory({ content: sanitizedMessage, role: 'user' })
    }
    setIsLoading(true)

    try {
      const response = await sendLlmMessage(sessionId, currentStep.path, {
        content: sanitizedMessage,
      })
      setSession((prevSession) =>
        prevSession === undefined
          ? undefined
          : {
            ...prevSession,
            ...response,
            overrideStep: response.overrideStep,
          },
      )

      if (!response.newConversation) {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error sending message', { error })
      setErrorMessage('We apologize, but there was an error sending your chat message.')
    }
  }

  const onChangeConfidence = async (newConfidence: string): Promise<void> => {
    if (!session || newConfidence === session?.context.confidence) {
      return
    }

    setIsLoading(true)
    const { confidence, dividers, newConversation, overrideStep } = await changeConfidence(sessionId, newConfidence)
    setSession((prevSession) =>
      prevSession === undefined
        ? undefined
        : {
          ...prevSession,
          context: {
            ...prevSession.context,
            confidence,
          },
          dividers,
          newConversation,
          overrideStep,
        },
    )
  }

  useEffect(() => {
    if (session?.newConversation && currentStep) {
      const text =
        session.context.possibleConfidenceLevels.find((level) => level.value === session.context.confidence)?.text ??
        session.context.confidence
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
        console.error('Error fetching chat session', { error })
        setErrorMessage('We apologize, but we were unable to load your chat session.')
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
      errorMessage,
      finished: true,
      history: [],
      isLoading,
      onChangeConfidence,
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
    errorMessage,
    finished,
    history: session.history,
    isLoading,
    onChangeConfidence,
    sendChatMessage,
  }
}
