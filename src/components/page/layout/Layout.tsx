import Head from 'next/head'
import type { JSX, ReactNode } from 'react'
import { practice } from '../../../core/practice'
import Banner from '../banner/Banner'
import Footer from '../footer/Footer'
import Header from '../header/Header'

interface Props {
  children: ReactNode
  title?: string
  description?: string
}

const Layout = ({ children, title, description }: Props): JSX.Element => {
  const documentTitle = title ? `${title} · ${practice.name}` : practice.name

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <div className="flex min-h-screen flex-col bg-paper text-ink">
        <a
          href="#inhoud"
          className="button button-ink sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Naar de inhoud
        </a>
        <Banner />
        <Header />
        <main id="inhoud" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
