import { useQuery } from '@tanstack/react-query'

import { fetchSession, isStillLoading, POLL_INTERVAL_MS } from '@services/sse'
import { Session, SessionId } from '@types'

export const SESSION_QUERY_KEY = 'session'

export interface UseSessionQueryResult {
  session: Session | undefined
  error: Error | null
}

export const useSessionQuery = (sessionId: SessionId | undefined): UseSessionQueryResult => {
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

  return { session, error }
}
