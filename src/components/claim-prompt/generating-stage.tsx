import { Spinner } from '@heroui/react'
import React from 'react'

const GeneratingStage = (): React.ReactNode => {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 px-3 py-6 text-center">
      <h4 className="text-3xl font-normal">Generating claims to discuss</h4>
      <p className="text-sm italic">This may take a few seconds</p>
      <Spinner />
    </div>
  )
}

export default GeneratingStage
