import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { fetchSession, isStillLoading, POLL_INTERVAL_MS } from '@services/sse'
import { Session, SessionId } from '@types'

export const SESSION_QUERY_KEY = 'session'

export interface UseSessionQueryResult {
  session: Session | undefined
  error: Error | null
  startPolling: () => void
}

export const useSessionQuery = (sessionId: SessionId | undefined): UseSessionQueryResult => {
  const queryClient = useQueryClient()

  const { data: session, error } = useQuery({
    queryKey: [SESSION_QUERY_KEY, sessionId],
    queryFn: () => fetchSession(sessionId!),
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (data && isStillLoading(data.loadingTimeout)) {
        return POLL_INTERVAL_MS
      }
      return false
    },
    refetchOnWindowFocus: false,
  })

  const startPolling = useCallback(() => {
    if (sessionId) {
      queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY, sessionId] })
    }
  }, [sessionId, queryClient])

  return { session, error, startPolling }
}
