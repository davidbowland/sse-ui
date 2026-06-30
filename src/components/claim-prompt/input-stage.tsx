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

const CYCLE_MS = 6_000
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
          style={{
            fontFamily: 'var(--font)',
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '-0.018em',
            color: 'var(--text)',
          }}
        >
          What do you believe?
        </h4>
      </div>

      <div className="mb-6 w-full text-left">
        <label
          htmlFor="truth-claim"
          style={{
            display: 'block',
            fontFamily: 'var(--font)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent-42)',
            marginBottom: '9px',
          }}
        >
          Truth claim
        </label>
        <div style={{ position: 'relative' }}>
          <input
            autoComplete="off"
            className="w-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            id="truth-claim"
            onChange={(e) => setClaimInput(e.target.value)}
            onKeyUp={handleKeyUp}
            style={{
              fontFamily: 'var(--font)',
              fontSize: '14px',
              color: 'var(--text)',
              background: 'var(--surface-alt)',
              borderRadius: '12px',
              border: `1px solid ${errorMessage ? 'var(--error)' : 'var(--border)'}`,
              padding: '14px 16px',
              caretColor: 'var(--accent)',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            value={claimInput}
          />
          {!claimInput && (
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm italic"
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font)',
                opacity: exampleVisible ? 0.65 : 0,
                transition: `opacity ${FADE_MS}ms ease`,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 'calc(100% - 2rem)',
                paddingRight: '8px',
              }}
            >
              {EXAMPLE_CLAIMS[exampleIndex]}
            </span>
          )}
        </div>
        {errorMessage && (
          <p style={{ marginTop: '6px', fontSize: '13px', color: 'var(--error)', fontFamily: 'var(--font)' }}>
            {errorMessage}
          </p>
        )}
      </div>

      <TwoButtons
        button1={<SecondaryButton onPress={onSuggestionsRequested}>Suggest claims</SecondaryButton>}
        button2={<PrimaryButton onPress={submitClaim}>Submit</PrimaryButton>}
      />
      <p style={{ padding: '32px 0', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font)' }}>
        Suggested claims are only updated a few times per day
      </p>
      {browserLanguage !== 'en-US' && browserLanguage && (
        <div>
          <h5 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font)' }}>
            Chat language
          </h5>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font)' }}>
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
