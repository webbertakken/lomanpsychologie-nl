import type { BannerNotificationEntry, BannerNotificationSkeleton } from '../types/banner'
import type { MenuOptions, MenuProps, MenuSortOrderSkeleton } from '../types/menu'
import type { PageEntry, PageSkeleton } from '../types/page'
import { getContentfulClient } from './contentful'
import { buildMenu, sortByMenuOrder } from './navigation'

export interface SiteChrome {
  headerMenu: MenuProps
  footerMenu: MenuProps
  banner: BannerNotificationEntry | null
}

export const getPages = async (): Promise<PageEntry[]> => {
  const { items } = await getContentfulClient().getEntries<PageSkeleton>({
    content_type: 'page',
    include: 3,
  })
  return items
}

const getMenuSortOrder = async (menu: MenuOptions) => {
  const { items } = await getContentfulClient().getEntries<MenuSortOrderSkeleton>({
    content_type: 'menuSortOrder',
  })
  return items.find((order) => order.fields.menu === menu)
}

const getBanner = async (): Promise<BannerNotificationEntry | null> => {
  const { items } = await getContentfulClient().getEntries<BannerNotificationSkeleton>({
    content_type: 'bannerNotification',
  })
  return items[0] ?? null
}

/** Header, footer and banner: everything every page shows around its content. */
export const getSiteChrome = async (
  pages: PageEntry[],
  activePath: string,
): Promise<SiteChrome> => {
  const [headerOrder, footerOrder, banner] = await Promise.all([
    getMenuSortOrder('header'),
    getMenuSortOrder('footer'),
    getBanner(),
  ])

  const inHeader = pages.filter(({ fields }) => fields.shouldBeShownInHeader)
  const inFooter = pages.filter(({ fields }) => fields.shouldBeShownInFooter)

  return {
    headerMenu: buildMenu(sortByMenuOrder(inHeader, headerOrder), pages, activePath),
    footerMenu: buildMenu(sortByMenuOrder(inFooter, footerOrder), [], activePath),
    banner,
  }
}
