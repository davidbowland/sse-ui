declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_POLL_INTERVAL_MS: string
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string
      NEXT_PUBLIC_SSE_API_BASE_URL: string
    }
  }
}

export {}
