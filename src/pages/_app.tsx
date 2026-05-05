import type { AppProps /*, AppContext */ } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import 'tippy.js/dist/tippy.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Loman psychologiepraktijk</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
