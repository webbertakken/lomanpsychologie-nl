import type { SectionEntry } from '../types/section'
import { alternatesOf, type Language, type PagesByLanguage } from './languages'

/** A section a reader can jump to from the page's own index. */
export interface Anchor {
  slug: string
  title: string
}

/** Pages with fewer sections than this read fine without an index. */
export const minimumSectionsForIndex = 3

/** The section that lists the contracted health insurers, wherever it lives. */
export const insurersSlug = 'vergoeding'

const anchorable = ['section', 'officeHoursSection', 'faqSection']

export const anchorsOf = (sections: SectionEntry[]): Anchor[] =>
  sections
    .filter(({ sys }) => anchorable.includes(sys.contentType.sys.id))
    .map(({ fields }) => ({ slug: fields.slug as string, title: fields.title as string }))
    .filter(({ slug, title }) => slug && title)

const holdsInsurers = (sections: unknown): boolean =>
  Array.isArray(sections) &&
  sections.some((section: SectionEntry) => section?.fields?.slug === insurersSlug)

/** Where patients find the contracted insurers, as a path in the given language. */
export const insurersPathIn = (pages: PagesByLanguage, language: Language): string | null => {
  const page = pages.nl.find(({ fields }) => holdsInsurers(fields.sections))
  if (!page) return null
  const path = alternatesOf(page.sys.id, pages)[language]
  return `${path}#${insurersSlug}`
}
