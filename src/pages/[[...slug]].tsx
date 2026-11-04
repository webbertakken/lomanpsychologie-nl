import type { GetStaticPaths, GetStaticProps } from 'next'
import Page, { type PageProps } from '../components/page/Page'
import { asLanguage, languages, resolveRoute, withLanguage } from '../core/languages'
import { isResolved } from '../core/links'
import { activePathFor, pagePath } from '../core/navigation'
import { getPages, getPagesByLanguage, getSiteChrome } from '../core/site'
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
  const paths = (
    await Promise.all(
      languages.map(async (locale) =>
        (await getPages(locale)).flatMap((page) => {
          const { parentPage } = page.fields
          if (parentPage && !isResolved(parentPage)) return []
          const path = pagePath(page)
          return [{ params: { slug: path === '/' ? null : path.slice(1).split('/') }, locale }]
        }),
      ),
    )
  ).flat()

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params, locale }) => {
  const language = asLanguage(locale)
  const activePath = activePathFor(params?.slug ?? null)
  const pages = await getPagesByLanguage()
  const route = resolveRoute(pages, language, activePath)

  if (route.kind === 'notFound') {
    console.info(`[pages] no ${language} page for ${activePath}, answering 404`)
    return { notFound: true, revalidate: 60 }
  }

  if (route.kind === 'redirect') {
    const destination = withLanguage(route.language, route.path)
    console.info(`[pages] ${language} ${activePath} lives at ${destination}, redirecting`)
    return { redirect: { destination, permanent: false }, revalidate: 60 }
  }

  return {
    props: {
      page: replaceReferencesWithSlugs(route.page),
      chrome: await getSiteChrome(pages, language, activePath, route.alternates),
    },
    revalidate: 3, // hit the CMS at most once every 3 seconds
  }
}

export default Page
