import React from 'react'

export interface TwoButtonsProps {
  button1: React.ReactNode
  button2: React.ReactNode
}

const TwoButtons = ({ button1, button2 }: TwoButtonsProps): React.ReactNode => {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <div className="w-full sm:w-44">{button2}</div>
      <div className="w-full sm:w-44">{button1}</div>
    </div>
  )
}

export default TwoButtons
