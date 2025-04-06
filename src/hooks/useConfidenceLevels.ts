import { useEffect, useState } from 'react'

import { ConfidenceLevel } from '@types'
import { fetchConfidenceLevels } from '@services/sse'

export interface UseConfidenceLevelsResults {
  confidenceLevels: ConfidenceLevel[]
}

export const useConfidenceLevels = (): UseConfidenceLevelsResults => {
  const [confidenceLevels, setConfidenceLevels] = useState<ConfidenceLevel[]>([])

  useEffect(() => {
    fetchConfidenceLevels().then(setConfidenceLevels).catch((error) => { console.error('Error fetching confidence levels', { error }) })
  }, [])

  return {
    confidenceLevels,
  }
}
