declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SSE_API_BASE_URL: string
    }
  }
}

export {}
