import React from 'react'

export interface TwoButtonsProps {
  button1: React.ReactNode
  button2: React.ReactNode
  hasExtraPadding?: boolean
}

const TwoButtons = ({ button1, button2, hasExtraPadding }: TwoButtonsProps): React.ReactNode => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-0 sm:col-span-1 md:col-span-2" />
      <div
        className={`col-span-12 sm:col-span-4 md:col-span-3 ${hasExtraPadding ? 'sm:pr-0 pr-24' : ''}`}
        style={{ order: 2 }}
      >
        {button1}
      </div>
      <div className="col-span-0 sm:col-span-2" />
      <div
        className={`col-span-12 sm:col-span-4 md:col-span-3 ${hasExtraPadding ? 'sm:pr-0 pr-24' : ''}`}
        style={{ order: 1 }}
      >
        {button2}
      </div>
      <div className="col-span-0 sm:col-span-1 md:col-span-2" />
    </div>
  )
}

export default TwoButtons
