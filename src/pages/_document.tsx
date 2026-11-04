import { Head, Html, Main, NextScript } from 'next/document'
import type { JSX } from 'react'
import { applyStoredThemeScript, themeColours } from '../core/theme'

const Document = (): JSX.Element => (
  <Html>
    <Head>
      <meta name="theme-color" content={themeColours.light} media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content={themeColours.dark} media="(prefers-color-scheme: dark)" />
      <meta name="color-scheme" content="light dark" />
      {/* Applies a stored light or dark choice before the first paint. */}
      <script dangerouslySetInnerHTML={{ __html: applyStoredThemeScript }} />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
