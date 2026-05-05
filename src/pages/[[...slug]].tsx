import { GetStaticPaths, GetStaticProps } from 'next'
import Page from '../components/page/Page'
import { getContentfulClient } from '../core/contentful'
import { replacePathsRecursively } from '../core/utils'
import { BannerNotificationEntry, BannerNotificationProps } from '../types/banner'
import { MenuOptions, MenuSortOrderEntry, MenuSortOrderProps } from '../types/menu'
import { PageEntry, PageProps } from '../types/page'

const client = getContentfulClient()

const getPages = async (): Promise<PageEntry[]> => {
  const { items: pages } = await client.getEntries<PageProps>({
    content_type: 'page',
    include: 3,
  })

  return pages
}

const getMenuSortOrder = async (menu: MenuOptions): Promise<MenuSortOrderEntry> => {
  const { items: sortOrders } = await client.getEntries<MenuSortOrderProps>({
    content_type: 'menuSortOrder',
  })

  return sortOrders?.find((order) => order.fields.menu === menu)
}

const createMenuSortFn = (menuSortOrder: MenuSortOrderEntry) => {
  const sortOrder = menuSortOrder?.fields.pages.map(({ fields }) => fields.slug)

  return (a, b) => {
    if (b.fields.isHomePage) return 1
    return sortOrder.indexOf(a.fields.slug) - sortOrder.indexOf(b.fields.slug)
  }
}

const getBannerNotification = async (): Promise<BannerNotificationEntry> => {
  const { items: banners } = await client.getEntries<BannerNotificationProps>({
    content_type: 'bannerNotification',
  })

  return banners?.[0] || null
}

const getActivePath = (slug: null | string | string[]) => {
  if (slug === null) return '/'
  return typeof slug === 'string' ? `/${slug}` : `/${slug.join('/')}`
}

const getMenuStructure = (pages, activePath) => {
  return pages
    .filter(({ fields }) => !fields.parentPage)
    .map((page) => {
      const { slug: rootPageSlug, menuItemTitle: title, subtitle = '', icon = '' } = page.fields
      const path = page.fields.isHomePage ? '/' : `/${rootPageSlug}`
      const isActive = path === activePath

      // Pages can have `parentPage`, which is a hydrated reference to another page.
      const subPages = pages
        .filter(({ fields }) => fields.parentPage?.sys.id === page.sys.id)
        .filter(({ fields }) => fields.shouldBeShownInSubmenus)
        .sort((a, b) => a.fields.title.localeCompare(b.fields.title))
        .map((subPage) => {
          const {
            menuItemTitle: title,
            slug: subPageSlug,
            subtitle = '',
            icon = '',
          } = subPage.fields
          const subPath = `/${rootPageSlug}/${subPageSlug}`
          const isActive = subPath === activePath

          return { title, path: subPath, isActive, subtitle, icon }
        })

      return { title, path, isActive, subPages, subtitle, icon }
    })
}

const replaceReferencesWithSlugs = (rawPage) =>
  replacePathsRecursively(rawPage, ['fields.pageToLinkTo', 'fields.parentPage'], (value) => {
    if (!value) return
    const { slug, parentPage: parent } = value.fields

    const parentPage = parent
      ? {
          fields: {
            slug: parent.fields.slug,
            parentPage: parent.fields.parentPage,
          },
        }
      : undefined

    return { fields: { slug, parentPage } }
  })

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (await getPages()).map((page) => {
    const { slug: pageSlug, isHomePage, parentPage } = page.fields
    const parentSlug = parentPage?.fields.slug

    let slug = parentSlug ? [parentSlug, pageSlug] : [pageSlug]
    if (isHomePage) slug = null

    return { params: { slug } }
  })

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Route
  const fullSlug: string | string[] = params.slug || null
  const pageSlug = Array.isArray(fullSlug) ? fullSlug.slice(-1)[0] : fullSlug
  const activePath = getActivePath(fullSlug)

  // Page
  const pages = await getPages()
  const rawPage = pageSlug
    ? pages.find((page) => page.fields.slug === pageSlug)
    : pages.find((page) => page.fields.isHomePage)
  if (!rawPage) return { redirect: { destination: '/', permanent: false } }

  // Props
  const page = replaceReferencesWithSlugs(rawPage)
  const banner = await getBannerNotification()

  const headerSortOrder = await getMenuSortOrder('header')
  const headerMenu = getMenuStructure(
    pages
      .filter(({ fields }) => fields.shouldBeShownInHeader)
      .sort(createMenuSortFn(headerSortOrder)),
    activePath,
  )

  const footerSortOrder = await getMenuSortOrder('footer')
  const footerMenu = getMenuStructure(
    pages
      .filter(({ fields }) => fields.shouldBeShownInFooter)
      .sort(await createMenuSortFn(footerSortOrder)),
    'footer',
  )

  return {
    props: {
      page,
      banner,
      headerMenu,
      footerMenu,
    },
    revalidate: 3, // hit backend max once every 3 seconds
  }
}

export default Page
