import type { PageEntry } from '../types/page'
import { pagePath } from './navigation'

/** The site's languages, as Next.js names them in URLs (`/` and `/en`). */
export const languages = ['nl', 'en'] as const
export type Language = (typeof languages)[number]

export const defaultLanguage: Language = 'nl'

/** Contentful's locale code for each site language. */
export const contentfulLocale: Record<Language, string> = { nl: 'nl-NL', en: 'en-GB' }

export const languageNames: Record<Language, string> = { nl: 'Nederlands', en: 'English' }

export const isLanguage = (value: string | undefined): value is Language =>
  languages.includes(value as Language)

export const asLanguage = (value: string | undefined): Language =>
  isLanguage(value) ? value : defaultLanguage

export type PagesByLanguage = Record<Language, PageEntry[]>

/** The same page's path in every language, matched by its Contentful id. */
export type Alternates = Record<Language, string>

export const alternatesOf = (pageId: string, pages: PagesByLanguage): Alternates => {
  const pathIn = (language: Language) => {
    const page = pages[language].find(({ sys }) => sys.id === pageId)
    return page ? pagePath(page) : '/'
  }
  return { nl: pathIn('nl'), en: pathIn('en') }
}

export type Route =
  | { kind: 'page'; page: PageEntry; alternates: Alternates }
  | { kind: 'redirect'; language: Language; path: string }
  | { kind: 'notFound' }

const findBySlug = (pages: PageEntry[], slug: string | null) =>
  slug === null
    ? pages.find(({ fields }) => fields.isHomePage)
    : pages.find(({ fields }) => fields.slug === slug)

/**
 * Finds the page a visitor asked for. A slug from the other language (an old
 * Dutch link under `/en`, say) and a page at the wrong parent both redirect to
 * where the page lives in the requested language.
 */
export const resolveRoute = (
  pages: PagesByLanguage,
  language: Language,
  requestedPath: string,
): Route => {
  const slug = requestedPath === '/' ? null : (requestedPath.split('/').at(-1) ?? null)
  const other = languages.find((candidate) => candidate !== language) ?? defaultLanguage

  const page = findBySlug(pages[language], slug)
  if (page) {
    const path = pagePath(page)
    if (path !== requestedPath) return { kind: 'redirect', language, path }
    return { kind: 'page', page, alternates: alternatesOf(page.sys.id, pages) }
  }

  const fromOtherLanguage = findBySlug(pages[other], slug)
  if (fromOtherLanguage) {
    return {
      kind: 'redirect',
      language,
      path: alternatesOf(fromOtherLanguage.sys.id, pages)[language],
    }
  }

  return { kind: 'notFound' }
}

/** A path with its language prefix, as a link or redirect needs it. */
export const withLanguage = (language: Language, path: string): string =>
  language === defaultLanguage ? path : path === '/' ? `/${language}` : `/${language}${path}`
