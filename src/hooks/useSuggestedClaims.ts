import { validateClaim as postValidateClaim, suggestClaims } from '@services/sse'
import { useState } from 'react'
import { ValidatedClaim } from '@types'

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

  const fetchSuggestedClaims = async (language: string): Promise<void> => {
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
  }

  const validateClaim = async (claim: string, language: string): Promise<ValidatedClaim> => {
    const cachedClaim = validatedClaims[claim + language]
    if (cachedClaim) {
      setSuggestedClaims(cachedClaim.suggestions)
      return { inappropriate: cachedClaim.inappropriate, isTruthClaim: cachedClaim.isTruthClaim }
    }

    try {
      const { inappropriate, isTruthClaim, suggestions } = await postValidateClaim(claim, language)
      const newSuggestions = !inappropriate && isTruthClaim ? [claim, ...suggestions] : suggestions
      setSuggestedClaims(newSuggestions)
      setValidatedClaims((prevValue: any) => ({
        ...prevValue,
        [claim + language]: { inappropriate, isTruthClaim, suggestions: newSuggestions },
      }))
      return { inappropriate, isTruthClaim }
    } catch (error: any) {
      console.error('Error validating claim', { error })
      setErrorMessage('We apologize, but we encountered an error validating your claim.')
      return { inappropriate: true, isTruthClaim: false }
    }
  }

  return {
    errorMessage,
    fetchSuggestedClaims,
    suggestedClaims,
    validateClaim,
  }
}
