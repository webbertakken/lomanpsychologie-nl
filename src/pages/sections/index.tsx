import type { GetStaticProps } from 'next'
import Link from 'next/link'
import type { JSX } from 'react'
import Layout from '../../components/page/layout/Layout'
import PageHeader from '../../components/page/PageHeader'
import { getContentfulClient } from '../../core/contentful'
import type { BasicSectionEntry, BasicSectionSkeleton } from '../../types/section'

export const getStaticProps: GetStaticProps = async () => {
  const { items: sections } = await getContentfulClient().getEntries<BasicSectionSkeleton>({
    content_type: 'section',
  })

  return { props: { sections }, revalidate: 3 }
}

interface Props {
  sections: BasicSectionEntry[]
}

/** An index of every basic section, for previewing them one by one. */
export default function Sections({ sections }: Props): JSX.Element {
  return (
    <Layout title="Secties">
      <PageHeader title="Secties" />
      <ul className="sheet index-links">
        {sections.map(({ sys, fields }) => (
          <li key={sys.id}>
            <Link href={`/sections/${fields.slug}`}>{fields.title}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
