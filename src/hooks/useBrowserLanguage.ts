import { useMemo } from 'react'

export interface UseBrowserLanguageResults {
  browserLanguage: string
}

export const useBrowserLanguage = (): UseBrowserLanguageResults => {
  if (typeof window === 'undefined') {
    return { browserLanguage: 'en-US' }
  }

  const browserLanguage = useMemo(
    () => new URLSearchParams(window.location.search).get('language') || window.navigator.language,
    [window.location.search, window.navigator.language],
  )
  return { browserLanguage }
}
