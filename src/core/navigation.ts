import type { MenuProps, MenuSortOrderEntry } from '../types/menu'
import type { PageEntry } from '../types/page'
import { isResolved } from './links'

/** The site path a page is served at: `/`, `/slug` or `/parent/slug`. */
export const pagePath = (page: PageEntry): string => {
  const { slug, isHomePage, parentPage } = page.fields
  if (isHomePage) return '/'
  return isResolved(parentPage) ? `/${parentPage.fields.slug}/${slug}` : `/${slug}`
}

export const activePathFor = (slug: string | string[] | null | undefined): string => {
  if (!slug) return '/'
  return typeof slug === 'string' ? `/${slug}` : `/${slug.join('/')}`
}

/**
 * Orders pages as the author arranged them in a Contentful `menuSortOrder`.
 * The home page always leads; pages missing from the order keep their place.
 */
export const sortByMenuOrder = (
  pages: PageEntry[],
  menuSortOrder: MenuSortOrderEntry | undefined,
): PageEntry[] => {
  const order = (menuSortOrder?.fields.pages ?? [])
    .filter(isResolved)
    .map(({ fields }) => fields.slug)
  const rank = (page: PageEntry) => {
    if (page.fields.isHomePage) return -1
    const index = order.indexOf(page.fields.slug)
    return index === -1 ? order.length : index
  }

  return [...pages].sort((a, b) => rank(a) - rank(b))
}

/**
 * Builds a two-level menu from the given root pages. Sub pages come from
 * `allPages`, so a child shows in its parent's submenu even when the child
 * itself is not listed in this menu.
 */
export const buildMenu = (
  rootPages: PageEntry[],
  allPages: PageEntry[],
  activePath: string,
): MenuProps =>
  rootPages
    .filter(({ fields }) => !fields.parentPage)
    .map((page) => {
      const { menuItemTitle: title, subtitle = '', icon = '' } = page.fields
      const path = pagePath(page)

      const subPages = allPages
        .filter(({ fields }) => isResolved(fields.parentPage))
        .filter(({ fields }) => fields.parentPage.sys.id === page.sys.id)
        .filter(({ fields }) => fields.shouldBeShownInSubmenus)
        .sort((a, b) => a.fields.title.localeCompare(b.fields.title, 'nl'))
        .map((subPage) => {
          const subPath = pagePath(subPage)
          return {
            title: subPage.fields.menuItemTitle,
            subtitle: subPage.fields.subtitle ?? '',
            icon: subPage.fields.icon ?? '',
            path: subPath,
            isActive: subPath === activePath,
          }
        })

      const isActive =
        path === activePath || subPages.some((subPage) => subPage.path === activePath)

      return { title, path, isActive, subPages, subtitle, icon }
    })

/** The pages the header menu lists. The logo leads home, so the menu leaves the home page out. */
export const headerPagesOf = (pages: PageEntry[]): PageEntry[] =>
  pages.filter(({ fields }) => fields.shouldBeShownInHeader && !fields.isHomePage)
