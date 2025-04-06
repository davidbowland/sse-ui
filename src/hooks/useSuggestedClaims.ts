import { validateClaim as postValidateClaim, suggestClaims } from '@services/sse'
import { useState } from 'react'
import { ValidatedClaim } from '@types'

export interface UseSuggestedClaimsResults {
  fetchSuggestedClaims: () => Promise<void>
  suggestedClaims: string[]
  validateClaim: () => Promise<void>
}

export const useSuggestedClaims = () => {
  const [aiClaims, setAiClaims] = useState<string[] | undefined>(undefined)
  const [suggestedClaims, setSuggestedClaims] = useState<string[]>([])
  const [validatedClaims, setValidatedClaims] = useState<any>({})

  const fetchSuggestedClaims = async (): Promise<void> => {
    if (aiClaims) {
      setSuggestedClaims(aiClaims)
    } else {
      const { claims } = await suggestClaims()
      setSuggestedClaims(claims)
      setAiClaims(claims)
    }
  }

  const validateClaim = async (claim: string): Promise<ValidatedClaim> => {
    const cachedClaim = validatedClaims[claim]
    if (cachedClaim) {
      setSuggestedClaims(cachedClaim.suggestions)
      return { inappropriate: cachedClaim.inappropriate, isTruthClaim: cachedClaim.isTruthClaim }
    }
    const { inappropriate, isTruthClaim, suggestions } = await postValidateClaim(claim)
    const newSuggestions = !inappropriate && isTruthClaim ? [claim, ...suggestions] : suggestions
    setSuggestedClaims(newSuggestions)
    setValidatedClaims((prevValue: any) => ({ ...prevValue, [claim]: { inappropriate, isTruthClaim, suggestions: newSuggestions } }))
    return { inappropriate, isTruthClaim }
  }

  return {
    fetchSuggestedClaims,
    suggestedClaims,
    validateClaim,
  }
}
