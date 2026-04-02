import React from 'react'

export const PolicyContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="flex flex-col gap-4 p-8">{children}</div>
)

export const PolicyH5 = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <h5 className="text-2xl font-normal">{children}</h5>
)

export const PolicyH6 = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <h6 className="text-xl font-medium">{children}</h6>
)

export const PolicyBody = ({ children }: { children: React.ReactNode }): React.ReactNode => <p>{children}</p>

export const PolicyBodyDiv = ({ children }: { children: React.ReactNode }): React.ReactNode => <div>{children}</div>
