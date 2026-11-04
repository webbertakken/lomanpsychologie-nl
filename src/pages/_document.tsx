import { Head, Html, Main, NextScript } from 'next/document'
import type { JSX } from 'react'

const Document = (): JSX.Element => (
  <Html>
    <Head>
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#0e1a24" media="(prefers-color-scheme: dark)" />
      <meta name="color-scheme" content="light dark" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
