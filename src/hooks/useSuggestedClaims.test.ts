import { recaptchaToken, suggestedClaims, validationResult } from '@test/__mocks__'
import { renderHook, waitFor } from '@testing-library/react'

import { useSuggestedClaims } from './useSuggestedClaims'
import * as sse from '@services/sse'

jest.mock('@services/sse')

describe('useSuggestedClaims', () => {
  const claim = 'Bacon is delicious'
  const language = 'en-US'

  const grecaptchaExecute = jest.fn()
  const grecaptchaReady = jest.fn((cb: () => void) => cb())

  beforeAll(() => {
    jest.mocked(sse).suggestClaims.mockResolvedValue({ claims: suggestedClaims })
    jest.mocked(sse).validateClaim.mockResolvedValue(validationResult)

    console.error = jest.fn()
    Object.defineProperty(window, 'grecaptcha', {
      configurable: true,
      value: { execute: grecaptchaExecute, ready: grecaptchaReady },
    })
    grecaptchaExecute.mockResolvedValue(recaptchaToken)
  })

  it('starts with no suggested claims', () => {
    const { result } = renderHook(() => useSuggestedClaims())

    expect(result.current.suggestedClaims).toEqual([])
  })

  it('injects the recaptcha script only once', () => {
    renderHook(() => useSuggestedClaims())
    renderHook(() => useSuggestedClaims())

    expect(document.querySelectorAll('#recaptcha-v3-script')).toHaveLength(1)
  })

  it('fetches suggested claims', async () => {
    const { result } = renderHook(() => useSuggestedClaims())
    await result.current.fetchSuggestedClaims(language)

    expect(grecaptchaExecute).toHaveBeenCalledWith(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
      action: 'SUGGEST_CLAIMS',
    })
    expect(sse.suggestClaims).toHaveBeenCalledWith(language, recaptchaToken)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
  })

  it('fetches suggested claims only once', async () => {
    const { result } = renderHook(() => useSuggestedClaims())

    await result.current.fetchSuggestedClaims(language)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
    await result.current.fetchSuggestedClaims(language)

    expect(sse.suggestClaims).toHaveBeenCalledTimes(1)
    expect(result.current.suggestedClaims).toEqual(suggestedClaims)
  })

  it('returns nothing when there is an error fetching claims', async () => {
    jest.mocked(sse).suggestClaims.mockRejectedValueOnce(new Error('Something went wrong'))
    const { result } = renderHook(() => useSuggestedClaims())
    await result.current.fetchSuggestedClaims(language)

    expect(sse.suggestClaims).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.errorMessage).toEqual(
        'We apologize, but we encountered an error compiling suggested claims.',
      )
    })
    expect(result.current.suggestedClaims).toEqual([])
  })

  it('returns nothing when recaptcha fails to load', async () => {
    grecaptchaReady.mockImplementationOnce(() => {
      throw new Error('reCAPTCHA failed to load')
    })
    const { result } = renderHook(() => useSuggestedClaims())
    await result.current.fetchSuggestedClaims(language)

    expect(sse.suggestClaims).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(result.current.errorMessage).toEqual(
        'We apologize, but we encountered an error compiling suggested claims.',
      )
    })
  })

  it('validates a claim and suggests others', async () => {
    const { result } = renderHook(() => useSuggestedClaims())
    const { inappropriate } = await result.current.validateClaim(claim, language)

    expect(grecaptchaExecute).toHaveBeenCalledWith(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
      action: 'VALIDATE_CLAIM',
    })
    expect(sse.validateClaim).toHaveBeenCalledWith(claim, language, recaptchaToken)
    expect(inappropriate).toEqual(validationResult.inappropriate)

    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
  })

  it('uses cached validation for duplicate requests', async () => {
    const { result } = renderHook(() => useSuggestedClaims())
    await result.current.validateClaim(claim, language)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
    const { inappropriate } = await result.current.validateClaim(claim, language)

    expect(sse.validateClaim).toHaveBeenCalledTimes(1)
    expect(inappropriate).toEqual(validationResult.inappropriate)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
  })

  it('omits inappropriate truth claims from suggestions', async () => {
    jest.mocked(sse).validateClaim.mockResolvedValueOnce({ ...validationResult, inappropriate: true })
    const { result } = renderHook(() => useSuggestedClaims())
    const { inappropriate } = await result.current.validateClaim(claim, language)

    expect(sse.validateClaim).toHaveBeenCalledTimes(1)
    expect(inappropriate).toEqual(true)
    await waitFor(() => expect(result.current.suggestedClaims).toEqual(suggestedClaims))
  })

  it('returns expected result when validate claim rejects', async () => {
    jest.mocked(sse).validateClaim.mockRejectedValueOnce(undefined)
    const { result } = renderHook(() => useSuggestedClaims())
    const { inappropriate } = await result.current.validateClaim(claim, language)

    expect(sse.validateClaim).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('We apologize, but we encountered an error validating your claim.')
    })
    expect(inappropriate).toEqual(true)
  })
})
