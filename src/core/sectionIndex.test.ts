import { describe, expect, it } from 'vitest'
import type { PageEntry } from '../types/page'
import type { SectionEntry } from '../types/section'
import type { PagesByLanguage } from './languages'
import { anchorsOf, insurersPathIn } from './sectionIndex'

const section = (type: string, slug: string, title: string): SectionEntry =>
  ({
    sys: { id: slug, type: 'Entry', contentType: { sys: { id: type } } },
    fields: { slug, title },
  }) as unknown as SectionEntry

const page = (id: string, slug: string, sections: SectionEntry[], home = false): PageEntry =>
  ({
    sys: { id, type: 'Entry' },
    fields: { slug, isHomePage: home, sections },
  }) as unknown as PageEntry

describe('anchorsOf', () => {
  it('lists the sections a reader can jump to, in page order', () => {
    const sections = [
      section('profileCardSection', 'anke-loman', 'Anke Loman'),
      section('section', 'locatie', 'Locatie'),
      section('officeHoursSection', 'openingstijden', 'Openingstijden'),
      section('faqSection', 'vragen-kosten', 'Kosten'),
    ]

    expect(anchorsOf(sections)).toEqual([
      { slug: 'locatie', title: 'Locatie' },
      { slug: 'openingstijden', title: 'Openingstijden' },
      { slug: 'vragen-kosten', title: 'Kosten' },
    ])
  })
})

describe('insurersPathIn', () => {
  const insurers = section('section', 'vergoeding', 'Vergoeding')
  const pages: PagesByLanguage = {
    nl: [page('home', 'home', [], true), page('fees', 'tarieven', [insurers])],
    en: [page('home', 'home', [], true), page('fees', 'rates', [insurers])],
  }

  it('points at the insurer list on whichever page holds it, in each language', () => {
    expect(insurersPathIn(pages, 'nl')).toBe('/tarieven#vergoeding')
    expect(insurersPathIn(pages, 'en')).toBe('/rates#vergoeding')
  })

  it('has no link when no page holds the insurer list', () => {
    const without: PagesByLanguage = { nl: [page('home', 'home', [], true)], en: [] }

    expect(insurersPathIn(without, 'nl')).toBeNull()
  })
})
