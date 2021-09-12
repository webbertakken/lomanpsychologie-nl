import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from '../../components/Layout'
import { getContentfulClient } from '../../core/contentful'
import { Entry } from 'contentful'
import Section from '../../components/Section'
import { SectionProps } from '../../types/section'

const client = getContentfulClient()

export const getStaticPaths: GetStaticPaths = async () => {
  const { items: sections } = await client.getEntries({
    content_type: 'section',
  })

  const paths = sections.map((item: Entry<any>) => {
    const { slug } = item.fields
    return { params: { slug } }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const { items } = await client.getEntries({
    content_type: 'section',
    'fields.slug': slug,
  })

  return {
    props: {
      section: items[0],
    },
  }
}

interface Props {
  section: SectionProps
}

export default function Sections({ section }: Props): JSX.Element {
  return (
    <Layout>
      <Section fields={section.fields} />
    </Layout>
  )
}
