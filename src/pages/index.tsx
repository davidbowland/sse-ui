import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import HomePage from '@components/home-page'
import SiteHead from '@components/site-head'
import { createSession } from '@services/sse'

const Index = (): React.ReactNode => {
  const router = useRouter()

  const onClaimSelect = useCallback(
    async (claim: string, confidence: string, language: string) => {
      const { sessionId } = await createSession(claim, confidence, language)
      router.push(`/c/${encodeURIComponent(sessionId)}`)
    },
    [router],
  )

  const [searchText, setSearchText] = useState('')
  useEffect(() => {
    setSearchText(window.location.search)
  }, [])
  const initialClaim = useMemo(() => new URLSearchParams(searchText).get('claim') || undefined, [searchText])

  return (
    <>
      <SiteHead title="StreetLogic AI" />
      <HomePage initialClaim={initialClaim} onClaimSelect={onClaimSelect} />
    </>
  )
}

export default Index
