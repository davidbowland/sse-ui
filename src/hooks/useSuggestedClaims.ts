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
      try {
        const { claims } = await suggestClaims()
        setSuggestedClaims(claims)
        setAiClaims(claims)
      } catch (error) {
        console.error('Error fetching suggested claims', { error })
      }
    }
  }

  const validateClaim = async (claim: string): Promise<ValidatedClaim> => {
    const cachedClaim = validatedClaims[claim]
    if (cachedClaim) {
      setSuggestedClaims(cachedClaim.suggestions)
      return { inappropriate: cachedClaim.inappropriate, isTruthClaim: cachedClaim.isTruthClaim }
    }

    try {
      const { inappropriate, isTruthClaim, suggestions } = await postValidateClaim(claim)
      const newSuggestions = !inappropriate && isTruthClaim ? [claim, ...suggestions] : suggestions
      setSuggestedClaims(newSuggestions)
      setValidatedClaims((prevValue: any) => ({ ...prevValue, [claim]: { inappropriate, isTruthClaim, suggestions: newSuggestions } }))
      return { inappropriate, isTruthClaim }
    } catch (error) {
      console.error('Error validating claim', { error })
      return { inappropriate: true, isTruthClaim: false }
    }
  }

  return {
    fetchSuggestedClaims,
    suggestedClaims,
    validateClaim,
  }
}
