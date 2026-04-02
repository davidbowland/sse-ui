import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'

import { SESSION_QUERY_KEY, useSessionQuery } from './useSessionQuery'
import {
  changeConfidence as changeConfidenceApi,
  isStillLoading,
  mergeConfidenceResponse,
  mergeMessageResponse,
  sendLlmMessage,
} from '@services/sse'
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

const EMPTY_RESULT: UseSessionResults = {
  chatStep: undefined,
  claim: undefined,
  confidence: undefined,
  confidenceLevels: [],
  conversationSteps: [],
  dividers: {},
  errorMessage: undefined,
  finished: true,
  history: [],
  isLoading: false,
  onChangeConfidence: async () => {},
  sendChatMessage: async () => {},
}

export const useSession = (sessionId: string | undefined): UseSessionResults => {
  const queryClient = useQueryClient()
  const { session, error: fetchError } = useSessionQuery(sessionId)

  const getSession = useCallback(
    (): Session | undefined => queryClient.getQueryData([SESSION_QUERY_KEY, sessionId]),
    [queryClient, sessionId],
  )

  const handleMutationSuccess = useCallback(
    (updatedSession: Session): void => {
      queryClient.setQueryData([SESSION_QUERY_KEY, sessionId], updatedSession)
    },
    [queryClient, sessionId],
  )

  const messageMutation = useMutation({
    mutationFn: ({ path, content }: { path: string; content: string; isAutoSend?: boolean }) =>
      sendLlmMessage(sessionId!, path, { content }),
    onSuccess: (response) => {
      const current = getSession()
      if (current) {
        handleMutationSuccess(mergeMessageResponse(current, response))
      }
    },
    onError: (error) => {
      console.error('Error sending message', { error })
    },
  })

  const confidenceMutation = useMutation({
    mutationFn: (newConfidence: string) => changeConfidenceApi(sessionId!, newConfidence),
    onSuccess: (response) => {
      const current = getSession()
      if (current) {
        handleMutationSuccess(mergeConfidenceResponse(current, response))
      }
    },
    onError: (error) => {
      console.error('Error changing confidence', { error })
    },
  })

  const currentStep = useMemo(
    () => session?.overrideStep ?? session?.conversationSteps.find((step) => step.value === session.currentStep),
    [session],
  )

  const isLoading = useMemo(() => {
    if (!session) return !!sessionId
    if (isStillLoading(session.loadingTimeout)) return true
    if (messageMutation.isPending || confidenceMutation.isPending) return true
    return session.newConversation
  }, [session, sessionId, messageMutation.isPending, confidenceMutation.isPending])

  const errorMessage = useMemo(() => {
    if (fetchError) return 'We apologize, but we were unable to load your chat session.'
    if (messageMutation.error) return 'We apologize, but there was an error sending your chat message.'
    if (confidenceMutation.error) return 'We apologize, but there was an error changing your confidence level.'
    return undefined
  }, [fetchError, messageMutation.error, confidenceMutation.error])

  // Derive history: append pending user message if the server hasn't included it yet
  const history = useMemo(() => {
    if (!session) return []
    const serverHistory = session.history
    const pending = messageMutation.variables
    if (!pending || pending.isAutoSend) return serverHistory

    const isPendingOrPolling = messageMutation.isPending || isStillLoading(session.loadingTimeout)
    if (!isPendingOrPolling) return serverHistory

    const pendingMessage: ChatMessage = { content: pending.content, role: 'user' }
    const alreadyInHistory = serverHistory.some((msg) => msg.role === 'user' && msg.content === pending.content)
    return alreadyInHistory ? serverHistory : [...serverHistory, pendingMessage]
  }, [session, messageMutation.variables, messageMutation.isPending])

  const sendChatMessage = useCallback(
    async (message: string, newConversation?: boolean): Promise<void> => {
      const sanitizedMessage = message.trim().replace(/\r|\n/g, '')
      if (!currentStep) return

      messageMutation.mutate({
        path: currentStep.path,
        content: sanitizedMessage,
        isAutoSend: !!newConversation,
      })
    },
    [currentStep, messageMutation],
  )

  const onChangeConfidence = useCallback(
    async (newConfidence: string): Promise<void> => {
      if (!session || newConfidence === session.context.confidence) return
      confidenceMutation.mutate(newConfidence)
    },
    [session?.context.confidence, confidenceMutation],
  )

  // Auto-send when newConversation is true
  useEffect(() => {
    if (session?.newConversation && currentStep && !messageMutation.isPending) {
      const text =
        session.context.possibleConfidenceLevels.find((level) => level.value === session.context.confidence)?.text ??
        session.context.confidence
      sendChatMessage(`I ${text} with the claim: ${session.context.claim}`, true)
    }
  }, [currentStep])

  if (!session) {
    return { ...EMPTY_RESULT, errorMessage, isLoading, onChangeConfidence, sendChatMessage }
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
    history,
    isLoading,
    onChangeConfidence,
    sendChatMessage,
  }
}
