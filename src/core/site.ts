import type { BannerNotificationEntry, BannerNotificationSkeleton } from '../types/banner'
import type { MenuOptions, MenuProps, MenuSortOrderSkeleton } from '../types/menu'
import type { PageEntry, PageSkeleton } from '../types/page'
import type { RegistrationStopEntry, RegistrationStopSkeleton } from '../types/registrationStop'
import { getContentfulClient } from './contentful'
import {
  alternatesOf,
  contentfulLocale,
  type Alternates,
  type Language,
  languages,
  type PagesByLanguage,
} from './languages'
import { buildMenu, sortByMenuOrder } from './navigation'
import { insurersPathIn } from './sectionIndex'

export interface SiteChrome {
  headerMenu: MenuProps
  footerMenu: MenuProps
  banner: BannerNotificationEntry | null
  registrationStop: RegistrationStopEntry | null
  /** Where the contracted insurers are listed, linked from every page index. */
  insurersPath: string | null
  contactPath: string
  /** This page's path in each language, for the language switch. */
  alternates: Alternates
}

const contactSlug = 'contact'

export const getPages = async (language: Language): Promise<PageEntry[]> => {
  const { items } = await getContentfulClient().getEntries<PageSkeleton>({
    content_type: 'page',
    include: 3,
    locale: contentfulLocale[language],
  })
  return items
}

export const getPagesByLanguage = async (): Promise<PagesByLanguage> => {
  const [nl, en] = await Promise.all(languages.map(getPages))
  return { nl, en }
}

const getMenuSortOrder = async (menu: MenuOptions, language: Language) => {
  const { items } = await getContentfulClient().getEntries<MenuSortOrderSkeleton>({
    content_type: 'menuSortOrder',
    locale: contentfulLocale[language],
  })
  return items.find((order) => order.fields.menu === menu)
}

const getBanner = async (language: Language): Promise<BannerNotificationEntry | null> => {
  const { items } = await getContentfulClient().getEntries<BannerNotificationSkeleton>({
    content_type: 'bannerNotification',
    locale: contentfulLocale[language],
  })
  return items[0] ?? null
}

const getRegistrationStop = async (language: Language): Promise<RegistrationStopEntry | null> => {
  const { items } = await getContentfulClient().getEntries<RegistrationStopSkeleton>({
    content_type: 'registrationStop',
    locale: contentfulLocale[language],
  })
  return items[0] ?? null
}

const contactPathIn = (pages: PagesByLanguage, language: Language): string => {
  const contact = pages.nl.find(({ fields }) => fields.slug === contactSlug)
  return contact ? alternatesOf(contact.sys.id, pages)[language] : `/${contactSlug}`
}

/** Header, footer, banner and registration stop: everything every page shows around its content. */
export const getSiteChrome = async (
  pages: PagesByLanguage,
  language: Language,
  activePath: string,
  alternates: Alternates = { nl: '/', en: '/' },
): Promise<SiteChrome> => {
  const [headerOrder, footerOrder, banner, registrationStop] = await Promise.all([
    getMenuSortOrder('header', language),
    getMenuSortOrder('footer', language),
    getBanner(language),
    getRegistrationStop(language),
  ])

  const inLanguage = pages[language]
  const inHeader = inLanguage.filter(({ fields }) => fields.shouldBeShownInHeader)
  const inFooter = inLanguage.filter(({ fields }) => fields.shouldBeShownInFooter)

  return {
    headerMenu: buildMenu(sortByMenuOrder(inHeader, headerOrder), inLanguage, activePath),
    footerMenu: buildMenu(sortByMenuOrder(inFooter, footerOrder), [], activePath),
    banner,
    registrationStop,
    insurersPath: insurersPathIn(pages, language),
    contactPath: contactPathIn(pages, language),
    alternates,
  }
}
