import { Switch } from '@heroui/react'
import React, { useCallback, useEffect, useState } from 'react'

import { PrimaryButton, SecondaryButton } from './elements'
import TwoButtons from './two-buttons'
import { useBrowserLanguage } from '@hooks/useBrowserLanguage'

const EXAMPLE_CLAIMS = [
  'e.g., Climate change is primarily human-caused',
  'e.g., Free will is an illusion',
  'e.g., God exists',
  'e.g., Science is the best path to truth',
  'e.g., Democracy is the best form of government',
  'e.g., Danny Trejo is a good role model',
  'e.g., Consciousness is purely physical',
  'e.g., Moral facts are objective',
  'e.g., Expertise is generally trustworthy',
  'e.g., Intuition is a reliable guide to truth',
]

const CYCLE_MS = 6000
const FADE_MS = 350

export interface InputStageProps {
  errorMessage?: string
  initialClaim: string
  language: string
  onClaimSubmit: (claim: string) => void
  onLanguageChange: (language: string) => void
  onSuggestionsRequested: () => void
}

const InputStage = ({
  errorMessage,
  initialClaim,
  language,
  onClaimSubmit,
  onLanguageChange,
  onSuggestionsRequested,
}: InputStageProps): React.ReactNode => {
  const [claimInput, setClaimInput] = useState<string>(initialClaim)
  const { browserLanguage } = useBrowserLanguage()

  const [exampleIndex, setExampleIndex] = useState(0)
  const [exampleVisible, setExampleVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleVisible(false)
      const fadeTimer = setTimeout(() => {
        setExampleIndex((prev) => (prev + 1) % EXAMPLE_CLAIMS.length)
        setExampleVisible(true)
      }, FADE_MS)
      return () => clearTimeout(fadeTimer)
    }, CYCLE_MS)
    return () => clearInterval(interval)
  }, [])

  const handleLanguageChange = useCallback(
    (checked: boolean) => {
      onLanguageChange(checked ? browserLanguage : 'en-US')
    },
    [onLanguageChange, browserLanguage],
  )

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onClaimSubmit(claimInput.trim())
      }
    },
    [onClaimSubmit, claimInput],
  )

  const submitClaim = useCallback(() => {
    onClaimSubmit(claimInput.trim())
  }, [onClaimSubmit, claimInput])

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-0 px-2 text-center">
      <div className="pb-6">
        <h4
          className="text-3xl font-normal italic"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          What do you believe?
        </h4>
      </div>

      {/* Custom input with animated placeholder */}
      <div className="mb-6 w-full text-left">
        <label
          className="mb-1.5 block text-sm font-medium"
          htmlFor="truth-claim"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-ui)' }}
        >
          Truth claim
        </label>
        <div className="relative">
          <input
            autoComplete="off"
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors"
            id="truth-claim"
            onChange={(e) => setClaimInput(e.target.value)}
            onKeyUp={handleKeyUp}
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: errorMessage ? '#ef4444' : 'var(--color-border)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-ui)',
              caretColor: 'var(--color-brand)',
            }}
            value={claimInput}
          />
          {!claimInput && (
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm italic"
              style={{
                color: 'var(--color-text-muted)',
                opacity: exampleVisible ? 0.65 : 0,
                transition: `opacity ${FADE_MS}ms ease`,
                fontFamily: 'var(--font-ui)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: 'calc(100% - 2rem)',
              }}
            >
              {EXAMPLE_CLAIMS[exampleIndex]}
            </span>
          )}
        </div>
        {errorMessage && (
          <p className="mt-1.5 text-sm" style={{ color: '#ef4444', fontFamily: 'var(--font-ui)' }}>
            {errorMessage}
          </p>
        )}
      </div>

      <TwoButtons
        button1={<SecondaryButton onPress={onSuggestionsRequested}>Suggest claims</SecondaryButton>}
        button2={<PrimaryButton onPress={submitClaim}>Submit</PrimaryButton>}
      />
      <p className="pb-8 pt-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Suggested claims are only updated a few times per day
      </p>
      {browserLanguage !== 'en-US' && browserLanguage && (
        <div>
          <h5 className="text-2xl font-normal">Chat language</h5>
          <div className="text-sm">
            en-US
            <Switch
              aria-label="Chat language switch"
              isSelected={language === browserLanguage}
              onChange={handleLanguageChange}
            />
            {browserLanguage}
          </div>
        </div>
      )}
    </div>
  )
}

export default InputStage
