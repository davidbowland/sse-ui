import { renderHook, waitFor } from '@testing-library/react'

import * as sse from '@services/sse'
import { suggestedClaims, validationResult } from '@test/__mocks__'
import { useSuggestedClaims } from './useSuggestedClaims'

jest.mock('@services/sse')

describe('useSuggestedClaims', () => {
  const claim = 'Bacon is delicious'

  beforeAll(() => {
    jest.mocked(sse).suggestClaims.mockResolvedValue({ claims: suggestedClaims })
    jest.mocked(sse).validateClaim.mockResolvedValue(validationResult)

    console.error = jest.fn()
  })

  it('starts with no suggested claims', () => {
    const { result } = renderHook(() => useSuggestedClaims())

    expect(result.current.suggestedClaims).toEqual([])
  })

  it('fetches suggested claims', async () => {
    const { result } = renderHook(() => useSuggestedClaims())
    await result.current.fetchSuggestedClaims()

    expect(sse.suggestClaims).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
  })

  it('fetches suggested claims only once', async () => {
    const { result } = renderHook(() => useSuggestedClaims())

    await result.current.fetchSuggestedClaims()
    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
    await result.current.fetchSuggestedClaims()

    expect(sse.suggestClaims).toHaveBeenCalledTimes(1)
    expect(result.current.suggestedClaims).toEqual(suggestedClaims)
  })

  it('returns nothing when there is an erro fetching claims', async () => {
    jest.mocked(sse).suggestClaims.mockRejectedValueOnce(new Error('Something went wrong'))
    const { result } = renderHook(() => useSuggestedClaims())
    await result.current.fetchSuggestedClaims()

    expect(sse.suggestClaims).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual([]))
  })

  it('validates a claim and suggests others', async () => {
    const { result } = renderHook(() => useSuggestedClaims())
    const { inappropriate, isTruthClaim } = await result.current.validateClaim(claim)

    expect(sse.validateClaim).toHaveBeenCalledTimes(1)
    expect(inappropriate).toEqual(validationResult.inappropriate)
    expect(isTruthClaim).toEqual(validationResult.isTruthClaim)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual([claim, ...suggestedClaims]))
  })

  it('uses cached validation for duplicate requests', async () => {
    const { result } = renderHook(() => useSuggestedClaims())
    await result.current.validateClaim(claim)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual([claim, ...suggestedClaims]))
    const { inappropriate, isTruthClaim } = await result.current.validateClaim(claim)

    expect(sse.validateClaim).toHaveBeenCalledTimes(1)
    expect(inappropriate).toEqual(validationResult.inappropriate)
    expect(isTruthClaim).toEqual(validationResult.isTruthClaim)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual([claim, ...suggestedClaims]))
  })

  it('omits inappropriate truth claims from suggestions', async () => {
    jest.mocked(sse).validateClaim.mockResolvedValueOnce({ ...validationResult, inappropriate: true })
    const { result } = renderHook(() => useSuggestedClaims())
    const { inappropriate, isTruthClaim } = await result.current.validateClaim(claim)

    expect(sse.validateClaim).toHaveBeenCalledTimes(1)
    expect(inappropriate).toEqual(true)
    expect(isTruthClaim).toEqual(validationResult.isTruthClaim)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
  })

  it("omits input that isn't a truth claim from suggestions", async () => {
    jest.mocked(sse).validateClaim.mockResolvedValueOnce({ ...validationResult, isTruthClaim: false })
    const { result } = renderHook(() => useSuggestedClaims())
    const { inappropriate, isTruthClaim } = await result.current.validateClaim(claim)

    expect(sse.validateClaim).toHaveBeenCalledTimes(1)
    expect(inappropriate).toEqual(validationResult.inappropriate)
    expect(isTruthClaim).toEqual(false)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
  })

  it('returns expected result when validate claim rejects', async () => {
    jest.mocked(sse).validateClaim.mockRejectedValueOnce(undefined)
    const { result } = renderHook(() => useSuggestedClaims())
    const { inappropriate, isTruthClaim } = await result.current.validateClaim(claim)

    expect(sse.validateClaim).toHaveBeenCalledTimes(1)
    expect(inappropriate).toEqual(true)
    expect(isTruthClaim).toEqual(false)
  })
})
