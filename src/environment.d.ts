declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GATSBY_SSE_API_BASE_URL: string
    }
  }
}

export {}
