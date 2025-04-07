import { renderHook, waitFor } from '@testing-library/react'

import { useBrowserLanguage } from './useBrowserLanguage'

describe('useBrowserLanguage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: { language: 'en-US' },
    })

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { search: '' },
    })
  })

  it('should return the defined language', async () => {
    const { result } = renderHook(() => useBrowserLanguage())

    await waitFor(() => {
      expect(result.current.browserLanguage).toEqual('en-US')
    })
  })

  it('should return the language from the URL', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { search: '?language=es-ES' },
    })
    const { result } = renderHook(() => useBrowserLanguage())

    await waitFor(() => {
      expect(result.current.browserLanguage).toEqual('es-ES')
    })
  })
})
