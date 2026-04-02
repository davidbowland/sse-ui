import { Spinner } from '@heroui/react'
import React, { useMemo } from 'react'

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

const getRandomSubtitle = () => SUBTITLE_OPTIONS[Math.floor(Math.random() * SUBTITLE_OPTIONS.length)]

const GeneratingStage = (): React.ReactNode => {
  const subtitle = useMemo(() => getRandomSubtitle(), [])

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 px-3 py-6 text-center">
      <h4 className="text-3xl font-normal">Generating claims to discuss</h4>
      <p className="text-sm italic">{subtitle}</p>
      <Spinner />
    </div>
  )
}

export default GeneratingStage
