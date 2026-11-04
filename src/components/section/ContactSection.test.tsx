import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ContactSectionEntry } from '../../types/section'
import ContactSection from './ContactSection'

const section = {
  sys: { id: 'contact', type: 'Entry', contentType: { sys: { id: 'contactSection' } } },
  fields: {
    title: 'Contact',
    slug: 'contact',
    street: 'Schoolstraat 27',
    postcode: '7642 AS',
    town: 'Wierden',
    building: 'gezondheidscentrum De Zonnehoed',
    routeUrl: 'https://maps.app.goo.gl/example',
    directions: ['Ga rechts langs de balie.', 'Neem de trap of de lift.'],
    publicTransport: 'Station op 500 meter.',
    email: 'info@lomanpsychologie.nl',
    emailNote: 'Het snelst.',
    phone: '06-21591133',
    phoneNote: 'Tijdens het spreekuur niet bereikbaar.',
    officeHours: { sys: { id: 'hours', type: 'Entry' }, fields: { monday: '08:00 - 18:00' } },
    crisis: 'Bel de huisartsenpost via 088-5880588.\n\nDenkt u aan zelfdoding? Bel 0800-0113.',
    registration: ['KvK-nummer: 83353550'],
  },
} as unknown as ContactSectionEntry

describe('ContactSection', () => {
  it('leads with the address and a route link', () => {
    render(<ContactSection section={section} />)

    expect(screen.getByText(/Schoolstraat 27/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Route plannen' })).toHaveAttribute(
      'href',
      'https://maps.app.goo.gl/example',
    )
  })

  it('lists the way to the waiting room in order', () => {
    render(<ContactSection section={section} />)

    const steps = within(
      screen.getByRole('list', { name: 'Zo vindt u de wachtkamer' }),
    ).getAllByRole('listitem')
    expect(steps.map((step) => step.textContent)).toEqual([
      '1Ga rechts langs de balie.',
      '2Neem de trap of de lift.',
    ])
  })

  it('makes e-mail, phone and the crisis numbers tappable', () => {
    render(<ContactSection section={section} />)

    expect(screen.getByRole('link', { name: 'info@lomanpsychologie.nl' })).toHaveAttribute(
      'href',
      'mailto:info@lomanpsychologie.nl',
    )
    expect(screen.getByRole('link', { name: '06-21591133' })).toHaveAttribute(
      'href',
      'tel:0621591133',
    )
    const crisis = screen.getByRole('complementary', { name: 'Bij crisis' })
    expect(within(crisis).getByRole('link', { name: '088-5880588' })).toHaveAttribute(
      'href',
      'tel:0885880588',
    )
    expect(within(crisis).getAllByRole('paragraph')).toHaveLength(2)
  })

  it('shows the opening hours it links to', () => {
    render(<ContactSection section={section} />)

    expect(screen.getByRole('rowheader', { name: /Maandag/ })).toBeInTheDocument()
    expect(screen.getByText('08:00 – 18:00')).toBeInTheDocument()
  })
})
