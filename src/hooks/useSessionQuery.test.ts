import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { session, sessionId } from '@test/__mocks__'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'

import { useSessionQuery } from './useSessionQuery'
import * as sse from '@services/sse'

jest.mock('@services/sse')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  Wrapper.displayName = 'QueryWrapper'
  return Wrapper
}

describe('useSessionQuery', () => {
  beforeAll(() => {
    console.error = jest.fn()
  })

  beforeEach(() => {
    jest.mocked(sse.fetchSession).mockReset()
  })

  it('fetches session on mount when sessionId is provided', async () => {
    jest.mocked(sse.fetchSession).mockResolvedValueOnce(session)
    const { result } = renderHook(() => useSessionQuery(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.session).toEqual(session))
    expect(sse.fetchSession).toHaveBeenCalledWith(sessionId)
  })

  it('does not fetch when sessionId is undefined', () => {
    renderHook(() => useSessionQuery(undefined), { wrapper: createWrapper() })

    expect(sse.fetchSession).not.toHaveBeenCalled()
  })

  it('returns error when fetch fails', async () => {
    jest.mocked(sse.fetchSession).mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useSessionQuery(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.error).toBeTruthy())
  })

  it('does not refetch when session has no loadingTimeout', async () => {
    const readySession = { ...session, loadingTimeout: undefined }
    jest.mocked(sse.fetchSession).mockResolvedValueOnce(readySession)

    renderHook(() => useSessionQuery(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(sse.fetchSession).toHaveBeenCalledTimes(1))
    expect(sse.fetchSession).toHaveBeenCalledTimes(1)
  })

  it('stops refetching when loadingTimeout is in the past', async () => {
    const expiredSession = { ...session, loadingTimeout: Date.now() - 1_000 }
    jest.mocked(sse.fetchSession).mockResolvedValue(expiredSession)

    renderHook(() => useSessionQuery(sessionId), { wrapper: createWrapper() })

    await waitFor(() => expect(sse.fetchSession).toHaveBeenCalledTimes(1))
    expect(sse.fetchSession).toHaveBeenCalledTimes(1)
  })
})
