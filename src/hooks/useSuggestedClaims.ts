import { validateClaim as postValidateClaim, suggestClaims } from '@services/sse'
import { ValidatedClaim } from '@types'
import { useCallback, useState } from 'react'

export interface UseSuggestedClaimsResults {
  errorMessage?: string
  fetchSuggestedClaims: () => Promise<void>
  suggestedClaims: string[]
  validateClaim: () => Promise<void>
}

export const useSuggestedClaims = () => {
  const [aiClaims, setAiClaims] = useState<string[] | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([])
  const [validatedClaims, setValidatedClaims] = useState<any>({})

  const fetchSuggestedClaims = useCallback(
    async (language: string): Promise<void> => {
      if (aiClaims) {
        setSuggestedClaims(aiClaims)
      } else {
        try {
          const { claims } = await suggestClaims(language)
          setSuggestedClaims(claims)
          setAiClaims(claims)
        } catch (error: any) {
          console.error('Error fetching suggested claims', { error })
          setErrorMessage('We apologize, but we encountered an error compiling suggested claims.')
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
        const { inappropriate, suggestions } = await postValidateClaim(claim, language)
        setSuggestedClaims(suggestions)
        setValidatedClaims((prevValue: any) => ({
          ...prevValue,
          [claim + language]: { inappropriate, suggestions },
        }))
        return { inappropriate }
      } catch (error: any) {
        console.error('Error validating claim', { error })
        setErrorMessage('We apologize, but we encountered an error validating your claim.')
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
