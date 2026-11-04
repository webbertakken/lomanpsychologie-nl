import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { FaqSectionEntry } from '../../types/section'
import FaqSection from './FaqSection'

const answer = (value: string) => ({
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [{ nodeType: 'text', value, marks: [], data: {} }],
    },
  ],
})

const item = (slug: string, question: string, text: string) => ({
  sys: { id: slug, type: 'Entry' },
  fields: { slug, question, answer: answer(text) },
})

const section = {
  sys: { id: 'faq', type: 'Entry', contentType: { sys: { id: 'faqSection' } } },
  fields: {
    title: 'Aanmelden',
    slug: 'vragen-aanmelden',
    subtitle: 'Voordat u start',
    questions: [
      item('verwijzing', 'Heb ik een verwijzing nodig?', 'Ja, van uw huisarts.'),
      { sys: { id: 'draft', type: 'Link', linkType: 'Entry' } },
      item('aanmelden', 'Hoe meld ik me aan?', 'Mail of bel 06-21591133.'),
    ],
  },
} as unknown as FaqSectionEntry

describe('FaqSection', () => {
  it('lists every published question, collapsed, under the section title', () => {
    render(<FaqSection section={section} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Aanmelden' })).toBeInTheDocument()
    expect(screen.getByText('Heb ik een verwijzing nodig?')).toBeVisible()
    expect(screen.getByText('Hoe meld ik me aan?')).toBeVisible()
    expect(screen.getAllByRole('group')).toHaveLength(2)
    expect(screen.getByText('Ja, van uw huisarts.')).not.toBeVisible()
  })

  it('opens an answer when its question is chosen', async () => {
    render(<FaqSection section={section} />)

    await userEvent.click(screen.getByText('Hoe meld ik me aan?'))

    expect(screen.getByRole('link', { name: '06-21591133' })).toBeVisible()
  })

  it('gives every question an anchor to link to', () => {
    const { container } = render(<FaqSection section={section} />)

    expect(container.querySelector('#verwijzing')).toHaveTextContent('Heb ik een verwijzing nodig?')
  })
})
