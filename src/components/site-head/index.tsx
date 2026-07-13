import Head from 'next/head'
import React from 'react'

export interface SiteHeadProps {
  title: string
}

const SiteHead = ({ title }: SiteHeadProps): React.ReactNode => (
  <Head>
    <title>{title}</title>
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta content={title} property="og:title" />
    <meta content={title} name="twitter:title" />
  </Head>
)

export default SiteHead
