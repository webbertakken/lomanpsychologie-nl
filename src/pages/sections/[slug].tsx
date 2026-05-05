import { Entry } from 'contentful'
import { GetStaticProps, GetStaticPaths } from 'next'
import LoadingPage from '../../components/loading/LoadingPage'
import Layout from '../../components/page/layout/Layout'
import Section from '../../components/section/Section'
import { getContentfulClient } from '../../core/contentful'
import { BasicSectionEntry } from '../../types/section'

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
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const { items } = await client.getEntries({
    content_type: 'section',
    'fields.slug': slug,
  })

  const section = items[0]
  return section
    ? { props: { section }, revalidate: 3 }
    : { redirect: { destination: '/', permanent: false } }
}

interface Props {
  section: BasicSectionEntry
}

export default function Sections({ section }: Props): JSX.Element {
  return <Layout>{section ? <Section section={section} /> : <LoadingPage />}</Layout>
}
