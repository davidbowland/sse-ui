import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Plus_Jakarta_Sans } from 'next/font/google'
import React, { useEffect } from 'react'

import '../styles/global.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font',
  display: 'swap',
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

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
    <QueryClientProvider client={queryClient}>
      <div className={plusJakartaSans.variable} style={{ minHeight: '100dvh' }}>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  )
}
