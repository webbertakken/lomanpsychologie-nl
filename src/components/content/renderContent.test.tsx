import type { Document } from '@contentful/rich-text-types'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderContent } from './renderContent'

const text = (value: string) => ({ nodeType: 'text', value, marks: [], data: {} })
const block = (nodeType: string, content: unknown[], data = {}) => ({ nodeType, content, data })
const richDocument = (...content: unknown[]) => block('document', content) as unknown as Document

const asset = (id: string, title: string, contentType: string) => ({
  sys: { id },
  fields: {
    title,
    file: {
      url: `//assets.example/${id}`,
      fileName: `${id}.bin`,
      contentType,
      details: { size: 226_200, image: { width: 80, height: 80 } },
    },
  },
})
const lvvp = asset('lvvp', 'LVVP', 'image/png')
const folder = asset('folder', 'Folder', 'application/pdf')

const renderDocument = (document: Document) => render(<div>{renderContent(document)}</div>)

describe('renderContent', () => {
  it('makes phone numbers and e-mail addresses in prose tappable', () => {
    renderDocument(
      richDocument(block('paragraph', [text('Mail info@lomanpsychologie.nl of bel 0621591133.')])),
    )

    expect(screen.getByRole('link', { name: 'info@lomanpsychologie.nl' })).toHaveAttribute(
      'href',
      'mailto:info@lomanpsychologie.nl',
    )
    expect(screen.getByRole('link', { name: '0621591133' })).toHaveAttribute(
      'href',
      'tel:0621591133',
    )
  })

  it('leaves out empty headings and empty paragraphs', () => {
    const { container } = renderDocument(
      richDocument(block('heading-3', [text('  ')]), block('paragraph', [text('')])),
    )

    expect(container.querySelector('h3, p')).toBeNull()
  })

  it('shows a table of logos as a row of images, once each', () => {
    const logoTable = block('table', [
      block('table-row', [
        block('table-cell', [
          block('paragraph', [block('asset-hyperlink', [text('LVVP')], { target: lvvp })]),
        ]),
      ]),
    ])
    const sameLogoAgain = block('embedded-asset-block', [], { target: lvvp })

    renderDocument(richDocument(logoTable, sameLogoAgain))

    expect(screen.queryByRole('table')).toBeNull()
    expect(screen.getAllByRole('img', { name: 'LVVP' })).toHaveLength(1)
  })

  it('shows an image embedded twice, as block and inline, once and without a frame', () => {
    const { container } = renderDocument(
      richDocument(
        block('embedded-asset-block', [], { target: lvvp }),
        block('paragraph', [block('asset-hyperlink', [text('')], { target: lvvp })]),
      ),
    )

    expect(screen.getAllByRole('img', { name: 'LVVP' })).toHaveLength(1)
    expect(container.querySelector('figure')).toBeNull()
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })

  it('offers documents as a download with their kind and size', () => {
    renderDocument(
      richDocument(block('paragraph', [block('asset-hyperlink', [text('')], { target: folder })])),
    )

    const link = screen.getByRole('link', { name: /Folder/ })
    expect(link).toHaveAttribute('href', 'https://assets.example/folder')
    expect(link).toHaveTextContent('PDF, 226 kB')
  })

  it('links to a sub page under its parent', () => {
    const target = {
      sys: { contentType: { sys: { id: 'page' } } },
      fields: { slug: 'emdr', parentPage: { fields: { slug: 'behandelingen' } } },
    }

    renderDocument(
      richDocument(block('paragraph', [block('entry-hyperlink', [text('EMDR')], { target })])),
    )

    expect(screen.getByRole('link', { name: 'EMDR' })).toHaveAttribute(
      'href',
      '/behandelingen/emdr',
    )
  })
})
