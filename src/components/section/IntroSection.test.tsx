import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { registrationStopOf, withChrome } from '../../test/chrome'
import type { ProfileSectionEntry, SectionEntry } from '../../types/section'
import IntroSection from './IntroSection'

const section = {
  sys: { id: 'intro', type: 'Entry', contentType: { sys: { id: 'profileCardSection' } } },
  fields: {
    title: 'Anke Loman',
    slug: 'over-mij',
    vocation: 'GZ-psycholoog',
    location: 'Wierden',
    photo: {
      sys: { id: 'photo', type: 'Asset' },
      fields: {
        file: {
          url: '//images.ctfassets.net/anke.jpg',
          details: { image: { width: 500, height: 902 } },
        },
      },
    },
  },
} as unknown as ProfileSectionEntry

const card = () => screen.getByRole('complementary', { name: 'Afspraak maken' })

describe('IntroSection appointment card', () => {
  it('invites a referred visitor to get in touch while registration is open', () => {
    render(<IntroSection section={section} pageSections={[]} />, { wrapper: withChrome({}) })

    expect(within(card()).getByText(/Neem contact op voor een eerste gesprek/)).toBeInTheDocument()
    expect(within(card()).queryByText('Aanmeldstop')).not.toBeInTheDocument()
  })

  it('leads with the registration stop instead of the invitation while it is on', () => {
    render(<IntroSection section={section} pageSections={[]} />, {
      wrapper: withChrome({
        registrationStop: registrationStopOf(true, 'Naar verwachting weer per januari 2027.'),
      }),
    })

    expect(within(card()).getByText('Aanmeldstop')).toBeInTheDocument()
    expect(within(card()).getByText('Naar verwachting weer per januari 2027.')).toBeInTheDocument()
    expect(within(card()).queryByText(/Neem contact op/)).not.toBeInTheDocument()
  })
})

describe('IntroSection index', () => {
  const pageSections = [
    {
      sys: { contentType: { sys: { id: 'section' } } },
      fields: { slug: 'over-mij', title: 'Over mij' },
    },
    {
      sys: { contentType: { sys: { id: 'section' } } },
      fields: { slug: 'wachttijden', title: 'Wachttijden' },
    },
  ] as unknown as SectionEntry[]

  it('links every section from its own index, outside the appointment card', () => {
    render(<IntroSection section={section} pageSections={pageSections} />, {
      wrapper: withChrome({}),
    })

    const index = screen.getByRole('navigation', { name: 'Op deze pagina' })
    expect(
      within(index)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['#over-mij', '#wachttijden'])
    expect(card()).not.toContainElement(index)
  })
})

describe('IntroSection reading order', () => {
  const withWords = {
    ...section,
    fields: {
      ...section.fields,
      shortDescription: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              { nodeType: 'text', value: 'persoonlijk en open-minded', marks: [], data: {} },
            ],
          },
        ],
      },
    },
  } as unknown as ProfileSectionEntry

  it('puts her own words before the appointment card', () => {
    render(<IntroSection section={withWords} pageSections={[]} />, { wrapper: withChrome({}) })

    const words = screen.getByText('persoonlijk en open-minded')
    expect(words.compareDocumentPosition(card()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
