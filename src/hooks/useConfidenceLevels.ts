import { fetchConfidenceLevels } from '@services/sse'
import { ConfidenceLevel } from '@types'
import { useEffect, useState } from 'react'

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
        console.error('Error fetching confidence levels', { error })
        setErrorMessage('We apologize, but we encountered an error retrieving confidence levels.')
      })
  }, [])

  return {
    confidenceLevels,
    errorMessage,
  }
}
