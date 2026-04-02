import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useSessionQuery } from './useSessionQuery'
import { changeConfidence, isStillLoading, sendLlmMessage } from '@services/sse'
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
  onChangeConfidence: (confidence: string) => Promise<void>
  sendChatMessage: (message: string) => Promise<void>
}

export const useSession = (sessionId: string | undefined): UseSessionResults => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(!!sessionId)
  const [session, setSession] = useState<Session | undefined>(undefined)
  const lastAppliedSessionRef = useRef<Session | undefined>(undefined)

  const { session: fetchedSession, error: fetchError, startPolling } = useSessionQuery(sessionId)

  useEffect(() => {
    if (
      fetchedSession &&
      fetchedSession !== lastAppliedSessionRef.current &&
      !isStillLoading(fetchedSession.loadingTimeout)
    ) {
      lastAppliedSessionRef.current = fetchedSession
      setSession(fetchedSession)
      setIsLoading(fetchedSession.newConversation)
    }
  }, [fetchedSession])

  useEffect(() => {
    if (fetchError) {
      console.error('Error fetching chat session', { error: fetchError })
      setErrorMessage('We apologize, but we were unable to load your chat session.')
    }
  }, [fetchError])

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

  const onChangeConfidence = useCallback(
    async (newConfidence: string): Promise<void> => {
      if (!session || newConfidence === session?.context.confidence) {
        return
      }

      setIsLoading(true)
      try {
        const { confidence, dividers, loadingTimeout, newConversation, overrideStep } = await changeConfidence(
          sessionId!,
          newConfidence,
        )

        if (loadingTimeout && loadingTimeout > Date.now()) {
          startPolling()
        } else {
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
      } catch (error: unknown) {
        console.error('Error changing confidence', { error })
        setErrorMessage('We apologize, but there was an error changing your confidence level.')
      }
    },
    [sessionId, session?.context.confidence, startPolling],
  )

  const sendChatMessage = useCallback(
    async (message: string, newConversation?: boolean): Promise<void> => {
      const sanitizedMessage = message.trim().replace(/\r|\n/g, '')
      if (!currentStep) {
        return
      } else if (!newConversation) {
        addMessageToHistory({ content: sanitizedMessage, role: 'user' })
      }
      setIsLoading(true)

      try {
        const response = await sendLlmMessage(sessionId!, currentStep.path, {
          content: sanitizedMessage,
        })

        if (response.loadingTimeout && response.loadingTimeout > Date.now()) {
          startPolling()
        } else {
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
        }
      } catch (error: unknown) {
        console.error('Error sending message', { error })
        setErrorMessage('We apologize, but there was an error sending your chat message.')
      }
    },
    [currentStep, sessionId, startPolling],
  )

  useEffect(() => {
    if (session?.newConversation && currentStep) {
      const text =
        session.context.possibleConfidenceLevels.find((level) => level.value === session.context.confidence)?.text ??
        session.context.confidence
      sendChatMessage(`I ${text} with the claim: ${session.context.claim}`, true)
    }
  }, [currentStep])

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
