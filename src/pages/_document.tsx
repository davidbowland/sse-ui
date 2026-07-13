import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          content="Explore your confidence in what you believe through a guided AI conversation, based on Street Epistemology techniques."
          name="description"
        />
        <meta content="website" property="og:type" />
        <meta content="StreetLogic AI" property="og:site_name" />
        <meta content="https://sse.dbowland.com" property="og:url" />
        <meta content="https://sse.dbowland.com/og-image.png" property="og:image" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        <meta
          content="Explore your confidence in what you believe through a guided AI conversation, based on Street Epistemology techniques."
          property="og:description"
        />
        <meta content="summary_large_image" name="twitter:card" />
        <meta
          content="Explore your confidence in what you believe through a guided AI conversation, based on Street Epistemology techniques."
          name="twitter:description"
        />
        <meta content="https://sse.dbowland.com/og-image.png" name="twitter:image" />
        <meta content="#f0f8fa" media="(prefers-color-scheme: light)" name="theme-color" />
        <meta content="#040a12" media="(prefers-color-scheme: dark)" name="theme-color" />
        <link href="/site.webmanifest" rel="manifest" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon-32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
      </Head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()",
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
