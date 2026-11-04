import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { BasicSectionEntry } from '../../types/section'
import BasicSection from './BasicSection'

const text = (value: string) => ({ nodeType: 'text', value, marks: [], data: {} })
const block = (nodeType: string, value: string) => ({ nodeType, data: {}, content: [text(value)] })

const section = (headings: string[]) =>
  ({
    sys: { id: 'privacy', type: 'Entry', contentType: { sys: { id: 'section' } } },
    fields: {
      title: 'Privacybeleid',
      slug: 'privacybeleid',
      content: {
        nodeType: 'document',
        data: {},
        content: headings.flatMap((heading) => [
          block('heading-3', heading),
          block('paragraph', 'Tekst.'),
        ]),
      },
    },
  }) as unknown as BasicSectionEntry

describe('BasicSection', () => {
  it('indexes the headings of a long text and links each to its heading', () => {
    const { container } = render(
      <BasicSection section={section(['Bewaartermijn', 'Beveiliging', 'Klachten', 'Vragen'])} />,
    )

    const index = screen.getByRole('navigation', { name: 'Op deze pagina' })
    const links = within(index).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      'Bewaartermijn',
      'Beveiliging',
      'Klachten',
      'Vragen',
    ])
    for (const link of links) {
      const target = container.querySelector(link.getAttribute('href') ?? '')
      expect(target?.tagName).toBe('H3')
      expect(target).toHaveTextContent(link.textContent ?? '')
    }
  })

  it('shows no index for a short text', () => {
    render(<BasicSection section={section(['Bewaartermijn', 'Klachten'])} />)

    expect(screen.queryByRole('navigation', { name: 'Op deze pagina' })).toBeNull()
  })
})
