import Head from 'next/head'
import type { JSX, ReactNode } from 'react'
import { languages, withLanguage } from '../../../core/languages'
import { practice } from '../../../core/practice'
import { useCopy, useLanguage } from '../../../core/useLanguage'
import Banner from '../banner/Banner'
import { useSiteChrome } from '../context/AppContext'
import Footer from '../footer/Footer'
import Header from '../header/Header'

interface Props {
  children: ReactNode
  title?: string
  description?: string
  /** The contact page already shows every contact detail, so the footer leaves them out. */
  isContactPage?: boolean
}

const Layout = ({ children, title, description, isContactPage }: Props): JSX.Element => {
  const documentTitle = title ? `${title} · ${practice.name}` : practice.name
  const copy = useCopy()
  const language = useLanguage()
  const { alternates } = useSiteChrome()

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
        {description && <meta name="description" content={description} />}
        {languages.map((code) => (
          <link
            key={code}
            rel="alternate"
            hrefLang={code}
            href={`https://www.lomanpsychologie.nl${withLanguage(code, alternates[code])}`}
          />
        ))}
        <meta property="og:locale" content={language === 'en' ? 'en_GB' : 'nl_NL'} />
      </Head>
      <div className="flex min-h-screen flex-col bg-paper text-ink">
        <a
          href="#inhoud"
          className="button button-ink sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          {copy.skipToContent}
        </a>
        <Banner />
        <Header />
        <main id="inhoud" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer showContact={!isContactPage} />
      </div>
    </>
  )
}

export default Layout
