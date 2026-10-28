import { GetStaticProps } from 'next'
import type { JSX } from 'react'
import Layout from '../../components/page/layout/Layout'
import SectionPreview from '../../components/section/SectionPreview'
import { getContentfulClient } from '../../core/contentful'
import { BasicSectionEntry, BasicSectionSkeleton } from '../../types/section'

export const getStaticProps: GetStaticProps = async (_context) => {
  const client = getContentfulClient()
  const { items: sections } = await client.getEntries<BasicSectionSkeleton>({
    content_type: 'section',
  })

  return {
    props: { sections },
    revalidate: 3,
  }
}

interface Props {
  sections: BasicSectionEntry[]
}

export default function Sections({ sections }: Props): JSX.Element {
  return (
    <Layout>
      <div className="list">
        {sections.map((section) => (
          <SectionPreview key={section.sys.id} section={section} />
        ))}
      </div>
    </Layout>
  )
}
