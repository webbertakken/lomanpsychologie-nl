import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { withChrome } from '../../test/chrome'
import SectionIndex from './SectionIndex'

const anchors = [
  { slug: 'locatie', title: 'Locatie' },
  { slug: 'kwaliteitsstatuut', title: 'Kwaliteitsstatuut' },
  { slug: 'openingstijden', title: 'Openingstijden' },
]
const index = () => screen.getByRole('navigation', { name: 'Op deze pagina' })
const hrefs = () =>
  within(index())
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))

describe('SectionIndex', () => {
  it('links every section, then the contracted insurers on the page that lists them', () => {
    render(<SectionIndex anchors={anchors} />, {
      wrapper: withChrome({ insurersPath: '/#vergoeding' }),
    })

    expect(hrefs()).toEqual(['#locatie', '#kwaliteitsstatuut', '#openingstijden', '/#vergoeding'])
    expect(
      within(index()).getByRole('link', { name: /Gecontracteerde zorgverzekeraars/ }),
    ).toBeInTheDocument()
  })

  it('links the insurers in place when this page lists them itself', () => {
    render(<SectionIndex anchors={[...anchors, { slug: 'vergoeding', title: 'Vergoeding' }]} />, {
      wrapper: withChrome({ insurersPath: '/#vergoeding' }),
    })

    expect(hrefs()).toEqual(['#locatie', '#kwaliteitsstatuut', '#openingstijden', '#vergoeding'])
  })

  it('leaves out the insurers when no page lists them', () => {
    render(<SectionIndex anchors={anchors} />, { wrapper: withChrome({ insurersPath: null }) })

    expect(hrefs()).toHaveLength(3)
  })
})
