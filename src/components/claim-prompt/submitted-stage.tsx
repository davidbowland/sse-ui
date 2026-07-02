import React, { useMemo } from 'react'

import { PremiumLoader } from './elements'

const SUBTITLE_OPTIONS = [
  'This oughta be fun',
  'Please be patient',
  "We're just seconds away!",
  'Just a moment',
  'Put on thinking caps now',
  'The ideal time for a bathroom break',
  'I bet you smell good',
  'Get ready to discuss!',
  "I hope you've been practicing",
  'FIGHT!',
  'How many licks DOES it take to get to the center of a Tootsie Pop?',
  '2.718281828459045',
  'Just enough time for a quick snack',
  "Let's get ready to ruuumble!",
  'Hang tight',
  'Drinks after?',
  'The best is yet to come',
  'Tick ... tock ...',
  'Un momento, por favor',
  'Going as fast as we can!',
  "I don't perform well under pressure",
  'Your patience is appreciated',
  `While you wait, the wifi password is: socrates${new Date().getFullYear()}`,
  'Almost there!',
  'Warming up my circuits',
]

export const getRandomSubtitle = (random = Math.random) =>
  SUBTITLE_OPTIONS[Math.floor(random() * SUBTITLE_OPTIONS.length)]

const SubmittedStage = (): React.ReactNode => {
  const subtitle = useMemo(() => getRandomSubtitle(), [])

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 px-3 py-8 text-center">
      <PremiumLoader />
      <div className="flex flex-col items-center gap-2">
        <h4 style={{ fontFamily: 'var(--font)', fontSize: '22px', fontWeight: 600, color: 'var(--text)' }}>
          Creating chat session
        </h4>
        <p style={{ fontFamily: 'var(--font)', fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default SubmittedStage
