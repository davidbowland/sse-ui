import React, { useMemo } from 'react'

import { PremiumLoader } from './elements'

const SUBTITLE_OPTIONS = [
  'This may take a few seconds',
  'Brewing up some hot takes',
  'Consulting the philosophers',
  'Rummaging through the idea drawer',
  'Summoning controversial opinions',
  'Sharpening the debate swords',
  'Asking the tough questions',
  'Dusting off the old arguments',
  'Loading spicy takes...',
  'Thinking really, really hard',
  'Stretching our critical thinking muscles',
  'Picking the juiciest claims',
  'This is the calm before the storm',
  'Gathering wisdom from the ether',
  'Preparing food for thought',
]

export const getRandomSubtitle = (random = Math.random) =>
  SUBTITLE_OPTIONS[Math.floor(random() * SUBTITLE_OPTIONS.length)]

const GeneratingStage = (): React.ReactNode => {
  const subtitle = useMemo(() => getRandomSubtitle(), [])

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 px-3 py-8 text-center">
      <PremiumLoader />
      <div className="flex flex-col items-center gap-2">
        <h4 style={{ fontFamily: 'var(--font)', fontSize: '22px', fontWeight: 600, color: 'var(--text)' }}>
          Generating claims to discuss
        </h4>
        <p style={{ fontFamily: 'var(--font)', fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default GeneratingStage
