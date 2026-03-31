import { useEffect, useMemo, useState } from 'react'

export interface UseBrowserLanguageResults {
  browserLanguage: string
}

export const useBrowserLanguage = (): UseBrowserLanguageResults => {
  const [searchText, setSearchText] = useState('')
  const [navigatorLanguage, setNavigatorLanguage] = useState('en-US')

  useEffect(() => {
    setSearchText(window.location.search)
    setNavigatorLanguage(window.navigator.language)
  }, [])

  const browserLanguage = useMemo(
    () => new URLSearchParams(searchText).get('language') || navigatorLanguage,
    [searchText, navigatorLanguage],
  )

  return { browserLanguage }
}
