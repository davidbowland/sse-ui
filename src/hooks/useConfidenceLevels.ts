import { useEffect, useState } from 'react'

import { fetchConfidenceLevels } from '@services/sse'
import { ConfidenceLevel } from '@types'

export interface UseConfidenceLevelsResults {
  confidenceLevels: ConfidenceLevel[]
  errorMessage?: string
}

export const useConfidenceLevels = (): UseConfidenceLevelsResults => {
  const [confidenceLevels, setConfidenceLevels] = useState<ConfidenceLevel[]>([])
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  useEffect(() => {
    fetchConfidenceLevels()
      .then(setConfidenceLevels)
      .catch((error: unknown) => {
        console.error('Error fetching confidence levels', { error })
        setErrorMessage("We couldn't load confidence levels.")
      })
  }, [])

  return {
    confidenceLevels,
    errorMessage,
  }
}
