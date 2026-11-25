import type { GetStaticPaths, GetStaticProps } from 'next'
import Page, { type PageProps } from '../components/page/Page'
import { asLanguage, languages, resolveRoute, withLanguage } from '../core/languages'
import { isResolved } from '../core/links'
import { activePathFor, pagePath } from '../core/navigation'
import { getPagesByLanguage, getSiteChrome } from '../core/site'
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

/** How often a visited page asks Contentful for fresh content, at most. */
const refreshAfterSeconds = 60

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getPagesByLanguage()
  const paths = languages.flatMap((locale) =>
    pages[locale].flatMap((page) => {
      const { parentPage } = page.fields
      if (parentPage && !isResolved(parentPage)) return []
      const path = pagePath(page)
      return [{ params: { slug: path === '/' ? null : path.slice(1).split('/') }, locale }]
    }),
  )

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params, locale }) => {
  const language = asLanguage(locale)
  const activePath = activePathFor(params?.slug ?? null)
  const pages = await getPagesByLanguage()
  const route = resolveRoute(pages, language, activePath)

  if (route.kind === 'notFound') {
    console.info(`[pages] no ${language} page for ${activePath}, answering 404`)
    // Kept until the next deploy: bots ask for countless made-up addresses, and
    // rechecking each one would cost Contentful calls on every visit.
    return { notFound: true }
  }

  if (route.kind === 'redirect') {
    const destination = withLanguage(route.language, route.path)
    console.info(`[pages] ${language} ${activePath} lives at ${destination}, redirecting`)
    return { redirect: { destination, permanent: false } }
  }

  return {
    props: {
      page: replaceReferencesWithSlugs(route.page),
      chrome: await getSiteChrome(pages, language, activePath, route.alternates),
    },
    revalidate: refreshAfterSeconds,
  }
}

export default Page
