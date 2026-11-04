import type { JSX } from 'react'
import { isResolved } from '../../core/links'
import { summarise } from '../../core/richText'
import type { SiteChrome } from '../../core/site'
import type { PageEntry } from '../../types/page'
import type { SectionEntry } from '../../types/section'
import Section, { introducesPage } from '../section/Section'
import { AppContext } from './context/AppContext'
import { PageTitleContext } from './context/PageTitleContext'
import Layout from './layout/Layout'
import PageHeader from './PageHeader'

export interface PageProps {
  page: PageEntry
  chrome: SiteChrome
}

const describe = (page: PageEntry, sections: SectionEntry[]): string | undefined => {
  const intro = sections.find((section) => section.sys.contentType.sys.id === 'profileCardSection')
  if (intro && 'shortDescription' in intro.fields) return summarise(intro.fields.shortDescription)
  return page.fields.subtitle || undefined
}

const Page = ({ page, chrome }: PageProps): JSX.Element => {
  const { title, subtitle, isHomePage } = page.fields
  const sections = (page.fields.sections ?? []).filter(isResolved) as SectionEntry[]
  const hasOwnHeading = sections.length > 0 && introducesPage(sections[0])

  return (
    <AppContext.Provider value={chrome}>
      <Layout
        title={isHomePage ? undefined : title}
        description={describe(page, sections)}
        isContactPage={sections.some(({ sys }) => sys.contentType.sys.id === 'contactSection')}
      >
        {!hasOwnHeading && <PageHeader title={title} lead={subtitle} />}
        <PageTitleContext.Provider value={title}>
          {sections.map((section, index) => (
            <Section
              key={section.sys.id}
              section={section}
              isFirst={index === 0}
              pageSections={sections}
            />
          ))}
        </PageTitleContext.Provider>
      </Layout>
    </AppContext.Provider>
  )
}

export default Page
