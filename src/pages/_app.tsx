import type { AppProps } from 'next/app'
import { Atkinson_Hyperlegible, Literata } from 'next/font/google'
import Head from 'next/head'
import type { JSX } from 'react'
import '../styles/globals.css'

const body = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})
const display = Literata({ subsets: ['latin'], display: 'swap', axes: ['opsz'] })

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Fonts are set on :root so dialogs portalled outside the app tree inherit them. */}
      <style jsx global>{`
        :root {
          --font-atkinson: ${body.style.fontFamily};
          --font-literata: ${display.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}

export default App
