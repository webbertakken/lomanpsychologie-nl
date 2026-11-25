import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type Query = Record<string, unknown>

const entry = (contentType: string, fields: Record<string, unknown>) => ({
  sys: { id: `${contentType}-id`, type: 'Entry', contentType: { sys: { id: contentType } } },
  fields,
})

const chromeEntries = [
  entry('menuSortOrder', { menu: 'header', pages: [] }),
  entry('menuSortOrder', { menu: 'footer', pages: [] }),
  entry('bannerNotification', { title: 'Vakantie' }),
  entry('registrationStop', { isEnabled: true, message: 'Vol' }),
]

const queries: Query[] = []
let failNext = false

vi.mock('./contentful', () => ({
  getContentfulClient: () => ({
    getEntries: async (query: Query) => {
      queries.push(query)
      if (failNext) {
        failNext = false
        throw new Error('Contentful is unreachable')
      }
      return { items: query.content_type === 'page' ? [] : chromeEntries }
    },
  }),
}))

const { getPagesByLanguage, getSiteChrome } = await import('./site')

// Each test starts an hour after the last, when every cached answer has expired.
let now = Date.parse('2026-11-25T12:00:00Z')

describe('site content', () => {
  beforeEach(() => {
    now += 60 * 60 * 1000
    vi.useFakeTimers()
    vi.setSystemTime(now)
    queries.length = 0
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('asks Contentful once per language for the menu orders, banner and registration stop', async () => {
    const chrome = await getSiteChrome({ nl: [], en: [] }, 'nl', '/')

    expect(queries).toEqual([
      expect.objectContaining({
        'sys.contentType.sys.id[in]': ['menuSortOrder', 'bannerNotification', 'registrationStop'],
        locale: 'nl-NL',
      }),
    ])
    expect(chrome.banner?.fields).toEqual({ title: 'Vakantie' })
    expect(chrome.registrationStop?.fields).toEqual({ isEnabled: true, message: 'Vol' })
  })

  it('answers a burst of page builds from one fetch of the pages', async () => {
    await getPagesByLanguage()
    await getPagesByLanguage()
    await getSiteChrome({ nl: [], en: [] }, 'en', '/')
    await getSiteChrome({ nl: [], en: [] }, 'en', '/rates')

    expect(queries).toHaveLength(3)
  })

  it('asks Contentful again once the cached answer is a few seconds old', async () => {
    await getPagesByLanguage()
    vi.advanceTimersByTime(30_000)
    await getPagesByLanguage()

    expect(queries).toHaveLength(4)
  })

  it('asks Contentful again after a failed fetch, instead of remembering the failure', async () => {
    failNext = true
    await expect(getPagesByLanguage()).rejects.toThrow('Contentful is unreachable')

    await getPagesByLanguage()

    expect(queries.filter(({ locale }) => locale === 'nl-NL')).toHaveLength(2)
  })
})
