import { useCallback, useEffect, useState } from 'react'

import { validateClaim as postValidateClaim, suggestClaims } from '@services/sse'
import { ValidatedClaim } from '@types'

export interface UseSuggestedClaimsResults {
  errorMessage?: string
  fetchSuggestedClaims: () => Promise<void>
  suggestedClaims: string[]
  validateClaim: () => Promise<void>
}

interface ValidatedClaimsCache {
  [key: string]: {
    inappropriate: boolean
    suggestions: string[]
  }
}

const RECAPTCHA_SCRIPT_ID = 'recaptcha-v3-script'
export const RECAPTCHA_TIMEOUT_MS = 10_000

/** Polls for the reCAPTCHA global then waits for it to be ready. Handles the case where
    the script tag hasn't finished loading yet when this is called. */
const waitForRecaptcha = (now = Date.now): Promise<void> =>
  new Promise((resolve, reject) => {
    const deadline = now() + RECAPTCHA_TIMEOUT_MS
    const check = () => {
      if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
        grecaptcha.ready(resolve)
      } else if (now() > deadline) {
        reject(new Error('reCAPTCHA failed to load'))
      } else {
        setTimeout(check, 100)
      }
    }
    check()
  })

/** Resolves the given action's reCAPTCHA token, bounding the entire "wait for ready, then
    execute" sequence with a single timeout so a hung grecaptcha.ready/execute callback can't
    stall the caller forever. */
const getRecaptchaToken = (action: string): Promise<string> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('reCAPTCHA failed to load')), RECAPTCHA_TIMEOUT_MS)
  })
  const token = waitForRecaptcha().then(() =>
    grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action }),
  )
  return Promise.race([token, timeout])
}

export const useSuggestedClaims = () => {
  const [aiClaims, setAiClaims] = useState<string[] | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([])
  const [validatedClaims, setValidatedClaims] = useState<ValidatedClaimsCache>({})

  useEffect(() => {
    if (!document.getElementById(RECAPTCHA_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = RECAPTCHA_SCRIPT_ID
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const fetchSuggestedClaims = useCallback(
    async (language: string): Promise<void> => {
      if (aiClaims) {
        setSuggestedClaims(aiClaims)
      } else {
        try {
          const token = await getRecaptchaToken('SUGGEST_CLAIMS')
          const { claims } = await suggestClaims(language, token)
          setSuggestedClaims(claims)
          setAiClaims(claims)
        } catch (error: unknown) {
          console.error('Error fetching suggested claims', { error })
          setErrorMessage("We couldn't generate suggested claims.")
        }
      }
    },
    [aiClaims],
  )

  const validateClaim = useCallback(
    async (claim: string, language: string): Promise<ValidatedClaim> => {
      const cachedClaim = validatedClaims[claim + language]
      if (cachedClaim) {
        setSuggestedClaims(cachedClaim.suggestions)
        return { inappropriate: cachedClaim.inappropriate }
      }

      try {
        const token = await getRecaptchaToken('VALIDATE_CLAIM')
        const { inappropriate, suggestions } = await postValidateClaim(claim, language, token)
        setSuggestedClaims(suggestions)
        setValidatedClaims((prevValue: ValidatedClaimsCache) => ({
          ...prevValue,
          [claim + language]: { inappropriate, suggestions },
        }))
        return { inappropriate }
      } catch (error: unknown) {
        console.error('Error validating claim', { error })
        setErrorMessage("We couldn't validate your claim.")
        return { inappropriate: true }
      }
    },
    [validatedClaims],
  )

  return {
    errorMessage,
    fetchSuggestedClaims,
    suggestedClaims,
    validateClaim,
  }
}
