import { useEffect, useState } from 'react'

import { ConfidenceLevel } from '@types'
import { fetchConfidenceLevels } from '@services/sse'

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
      .catch((error) => {
        setErrorMessage('Error fetching confidence levels.')
        console.error('Error fetching confidence levels', { error })
      })
  }, [])

  return {
    confidenceLevels,
    errorMessage,
  }
}
