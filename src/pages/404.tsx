import type { GetStaticProps } from 'next'
import Link from 'next/link'
import type { JSX } from 'react'
import { AppContext } from '../components/page/context/AppContext'
import Layout from '../components/page/layout/Layout'
import PageHeader from '../components/page/PageHeader'
import { asLanguage } from '../core/languages'
import { getPagesByLanguage, getSiteChrome, type SiteChrome } from '../core/site'
import { useCopy } from '../core/useLanguage'

export const getStaticProps: GetStaticProps<{ chrome: SiteChrome }> = async ({ locale }) => ({
  props: { chrome: await getSiteChrome(await getPagesByLanguage(), asLanguage(locale), '') },
  revalidate: 60,
})

const NotFound = ({ chrome }: { chrome: SiteChrome }): JSX.Element => {
  const copy = useCopy()

  return (
    <AppContext.Provider value={chrome}>
      <Layout title={copy.notFoundDocumentTitle}>
        <PageHeader title={copy.notFoundTitle}>
          <p>{copy.notFoundLead}</p>
        </PageHeader>
        <div className="sheet pb-24">
          <ul className="index-links">
            <li>
              <Link href="/">{copy.toHomePage}</Link>
            </li>
            {chrome.headerMenu
              .filter(({ path }) => path !== '/')
              .map(({ path, title }) => (
                <li key={path}>
                  <Link href={path}>{title}</Link>
                </li>
              ))}
            <li>
              <Link href={chrome.contactPath}>{copy.contactPractice}</Link>
            </li>
          </ul>
        </div>
      </Layout>
    </AppContext.Provider>
  )
}

export default NotFound
