import type { GetStaticPaths, GetStaticProps } from 'next'
import Page, { type PageProps } from '../components/page/Page'
import { isResolved } from '../core/links'
import { activePathFor, pagePath } from '../core/navigation'
import { getPages, getSiteChrome } from '../core/site'
import { replacePathsRecursively } from '../core/utils'
import type { PageEntry } from '../types/page'

// Pages link to each other; keep only what a link needs, so the props stay
// small and free of circular references.
const replaceReferencesWithSlugs = (rawPage: PageEntry): PageEntry =>
  replacePathsRecursively(rawPage, ['fields.pageToLinkTo', 'fields.parentPage'], (value) => {
    if (!isResolved(value)) return
    const { slug, parentPage: parent } = value.fields

    const parentPage = isResolved(parent)
      ? { sys: parent.sys, fields: { slug: parent.fields.slug } }
      : undefined

    return { sys: value.sys, fields: { slug, parentPage } }
  }) as PageEntry

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (await getPages()).flatMap((page) => {
    const { parentPage } = page.fields
    if (parentPage && !isResolved(parentPage)) return []
    const path = pagePath(page)
    return [{ params: { slug: path === '/' ? null : path.slice(1).split('/') } }]
  })

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug ?? null
  const activePath = activePathFor(slug)
  const pageSlug = Array.isArray(slug) ? slug.at(-1) : slug

  const pages = await getPages()
  const rawPage = pageSlug
    ? pages.find((page) => page.fields.slug === pageSlug)
    : pages.find((page) => page.fields.isHomePage)

  if (!rawPage) {
    console.info(`[pages] no page for ${activePath}, answering 404`)
    return { notFound: true, revalidate: 60 }
  }

  const canonicalPath = pagePath(rawPage)
  if (canonicalPath !== activePath) {
    console.info(`[pages] ${activePath} lives at ${canonicalPath}, redirecting`)
    return { redirect: { destination: canonicalPath, permanent: false }, revalidate: 60 }
  }

  return {
    props: {
      page: replaceReferencesWithSlugs(rawPage),
      chrome: await getSiteChrome(pages, activePath),
    },
    revalidate: 3, // hit the CMS at most once every 3 seconds
  }
}

export default Page
