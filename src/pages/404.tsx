import type { GetStaticProps } from 'next'
import Link from 'next/link'
import type { JSX } from 'react'
import { AppContext } from '../components/page/context/AppContext'
import Layout from '../components/page/layout/Layout'
import PageHeader from '../components/page/PageHeader'
import { getPages, getSiteChrome, type SiteChrome } from '../core/site'

export const getStaticProps: GetStaticProps<{ chrome: SiteChrome }> = async () => ({
  props: { chrome: await getSiteChrome(await getPages(), '') },
  revalidate: 60,
})

const NotFound = ({ chrome }: { chrome: SiteChrome }): JSX.Element => (
  <AppContext.Provider value={chrome}>
    <Layout title="Pagina niet gevonden">
      <PageHeader title="Deze pagina bestaat niet (meer)">
        <p>
          Misschien is de pagina verplaatst, of zat er een typefout in het adres. Hieronder vindt u
          de weg terug.
        </p>
      </PageHeader>
      <div className="sheet pb-24">
        <ul className="index-links">
          <li>
            <Link href="/">Naar de homepage</Link>
          </li>
          {chrome.headerMenu
            .filter(({ path }) => path !== '/')
            .map(({ path, title }) => (
              <li key={path}>
                <Link href={path}>{title}</Link>
              </li>
            ))}
          <li>
            <Link href="/contact">Contact met de praktijk</Link>
          </li>
        </ul>
      </div>
    </Layout>
  </AppContext.Provider>
)

export default NotFound
