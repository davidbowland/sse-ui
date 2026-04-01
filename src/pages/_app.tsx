import '@fontsource/roboto'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'

import '../styles/global.css'
import Disclaimer from '@components/disclaimer'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = (dark: boolean) => document.documentElement.classList.toggle('dark', dark)
    applyTheme(mq.matches)
    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <Disclaimer />
    </>
  )
}
