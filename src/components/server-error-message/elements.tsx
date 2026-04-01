import React from 'react'

export const ErrorContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="flex justify-center">
    <div className="flex w-full max-w-[900px] flex-col gap-4 p-8">{children}</div>
  </div>
)

export const ErrorTitle = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <h1 className="text-6xl font-light">{children}</h1>
)
