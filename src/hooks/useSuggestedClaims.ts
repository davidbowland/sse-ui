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
    const { inappropriate, isTruthClaim, suggestions } = await postValidateClaim(claim)
    setSuggestedClaims(!inappropriate && isTruthClaim ? [claim, ...suggestions] : suggestions)
    return { inappropriate, isTruthClaim }
  }

  return {
    fetchSuggestedClaims,
    suggestedClaims,
    validateClaim,
  }
}
