import { describe, expect, it } from 'vitest'
import type { PageEntry } from '../types/page'
import { asLanguage, type PagesByLanguage, resolveRoute, withLanguage } from './languages'

const page = (id: string, slug: string, fields: Record<string, unknown> = {}): PageEntry =>
  ({
    sys: { id, type: 'Entry' },
    fields: { slug, isHomePage: false, ...fields },
  }) as unknown as PageEntry

const dutchTreatments = page('treatments', 'behandelingen')
const englishTreatments = page('treatments', 'therapy')

const pages: PagesByLanguage = {
  nl: [
    page('home', 'home', { isHomePage: true }),
    page('fees', 'tarieven'),
    dutchTreatments,
    page('emdr', 'emdr', { parentPage: dutchTreatments }),
  ],
  en: [
    page('home', 'home', { isHomePage: true }),
    page('fees', 'rates'),
    englishTreatments,
    page('emdr', 'emdr', { parentPage: englishTreatments }),
  ],
}

describe('resolveRoute', () => {
  it('finds a page by its slug in the requested language, with its paths in both', () => {
    const route = resolveRoute(pages, 'en', '/rates')

    expect(route).toMatchObject({ kind: 'page', alternates: { nl: '/tarieven', en: '/rates' } })
  })

  it('finds the home page at the root', () => {
    expect(resolveRoute(pages, 'nl', '/')).toMatchObject({
      kind: 'page',
      alternates: { nl: '/', en: '/' },
    })
  })

  it('nests a sub page under its parent in each language', () => {
    expect(resolveRoute(pages, 'nl', '/behandelingen/emdr')).toMatchObject({
      kind: 'page',
      alternates: { nl: '/behandelingen/emdr', en: '/therapy/emdr' },
    })
  })

  it('redirects a slug from the other language to the page in the requested language', () => {
    expect(resolveRoute(pages, 'en', '/tarieven')).toEqual({
      kind: 'redirect',
      language: 'en',
      path: '/rates',
    })
  })

  it('redirects a sub page at the wrong parent to its own path', () => {
    expect(resolveRoute(pages, 'en', '/emdr')).toEqual({
      kind: 'redirect',
      language: 'en',
      path: '/therapy/emdr',
    })
  })

  it('answers not found for an unknown slug', () => {
    expect(resolveRoute(pages, 'nl', '/bestaat-niet')).toEqual({ kind: 'notFound' })
  })
})

describe('withLanguage', () => {
  it('leaves Dutch paths unprefixed and prefixes English ones', () => {
    expect(withLanguage('nl', '/tarieven')).toBe('/tarieven')
    expect(withLanguage('en', '/rates')).toBe('/en/rates')
    expect(withLanguage('en', '/')).toBe('/en')
  })
})

describe('asLanguage', () => {
  it('falls back to Dutch for an unknown locale', () => {
    expect(asLanguage('de')).toBe('nl')
    expect(asLanguage(undefined)).toBe('nl')
    expect(asLanguage('en')).toBe('en')
  })
})
