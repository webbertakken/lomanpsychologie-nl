import type { BannerNotificationEntry, BannerNotificationSkeleton } from '../types/banner'
import type {
  MenuOptions,
  MenuProps,
  MenuSortOrderEntry,
  MenuSortOrderSkeleton,
} from '../types/menu'
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
import { buildMenu, headerPagesOf, sortByMenuOrder } from './navigation'
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

/**
 * How long a fetched answer serves later requests. A build renders every page
 * within seconds, and a regeneration burst comes in together; both then ask
 * Contentful once instead of once per page.
 */
const answerLifetimeMs = 10_000

const remembered = new Map<string, { expiresAt: number; answer: Promise<unknown> }>()

const rememberBriefly = <Answer>(key: string, ask: () => Promise<Answer>): Promise<Answer> => {
  const now = Date.now()
  const cached = remembered.get(key)
  if (cached && cached.expiresAt > now) return cached.answer as Promise<Answer>

  const answer = ask()
  remembered.set(key, { expiresAt: now + answerLifetimeMs, answer })
  answer.catch(() => {
    if (remembered.get(key)?.answer === answer) remembered.delete(key)
  })
  return answer
}

export const getPages = (language: Language): Promise<PageEntry[]> =>
  rememberBriefly(`pages:${language}`, async () => {
    const { items } = await getContentfulClient().getEntries<PageSkeleton>({
      content_type: 'page',
      include: 3,
      locale: contentfulLocale[language],
    })
    console.info(`[contentful] fetched ${items.length} ${language} pages`)
    return items
  })

export const getPagesByLanguage = async (): Promise<PagesByLanguage> => {
  const [nl, en] = await Promise.all(languages.map(getPages))
  return { nl, en }
}

const chromeContentTypes = ['menuSortOrder', 'bannerNotification', 'registrationStop'] as const

type ChromeSkeleton = MenuSortOrderSkeleton | BannerNotificationSkeleton | RegistrationStopSkeleton

interface ChromeEntries {
  menuSortOrders: MenuSortOrderEntry[]
  banner: BannerNotificationEntry | null
  registrationStop: RegistrationStopEntry | null
}

/** Menu orders, banner and registration stop, in one request. */
const getChromeEntries = (language: Language): Promise<ChromeEntries> =>
  rememberBriefly(`chrome:${language}`, async () => {
    const { items } = await getContentfulClient().getEntries<ChromeSkeleton>({
      'sys.contentType.sys.id[in]': [...chromeContentTypes],
      locale: contentfulLocale[language],
    })
    console.info(`[contentful] fetched ${items.length} ${language} chrome entries`)
    const ofType = (id: (typeof chromeContentTypes)[number]) =>
      items.filter(({ sys }) => sys.contentType.sys.id === id)

    return {
      menuSortOrders: ofType('menuSortOrder') as MenuSortOrderEntry[],
      banner: (ofType('bannerNotification')[0] as BannerNotificationEntry | undefined) ?? null,
      registrationStop:
        (ofType('registrationStop')[0] as RegistrationStopEntry | undefined) ?? null,
    }
  })

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
  const { menuSortOrders, banner, registrationStop } = await getChromeEntries(language)
  const orderOf = (menu: MenuOptions) => menuSortOrders.find(({ fields }) => fields.menu === menu)
  const headerOrder = orderOf('header')
  const footerOrder = orderOf('footer')

  const inLanguage = pages[language]
  const inHeader = headerPagesOf(inLanguage)
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
