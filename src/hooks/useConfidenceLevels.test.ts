import { renderHook, waitFor } from '@testing-library/react'

import * as sse from '@services/sse'
import { confidenceLevels } from '@test/__mocks__'
import { useConfidenceLevels } from './useConfidenceLevels'

jest.mock('@services/sse')

describe('useConfidenceLevels', () => {
  beforeAll(() => {
    jest.mocked(sse).fetchConfidenceLevels.mockResolvedValue(confidenceLevels)

    console.error = jest.fn()
  })

  it('returns confidence levels', async () => {
    const { result } = renderHook(() => useConfidenceLevels())

    await waitFor(() => {
      expect(result.current.confidenceLevels).toEqual(confidenceLevels)
    })
  })

  it('returns an empty array + error message on error', async () => {
    jest.mocked(sse).fetchConfidenceLevels.mockRejectedValue(undefined)

    const { result } = renderHook(() => useConfidenceLevels())

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('Error fetching confidence levels.')
    })
    expect(result.current.confidenceLevels).toEqual([])
  })
})
