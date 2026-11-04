import type { Document, Node } from '@contentful/rich-text-types'
import { describe, expect, it } from 'vitest'
import { imagesInLayoutTable, isLongList, plainText, summarise } from './richText'

const text = (value: string) => ({ nodeType: 'text', value, marks: [], data: {} })
const block = (nodeType: string, content: unknown[], data = {}) => ({ nodeType, content, data })
const paragraph = (value: string) => block('paragraph', [text(value)])
const richDocument = (...content: unknown[]) => block('document', content) as unknown as Document

const imageLink = (title: string) =>
  block('asset-hyperlink', [text(title)], {
    target: { fields: { title, file: { contentType: 'image/png' } } },
  })
const cell = (...content: unknown[]) => block('table-cell', [block('paragraph', content)])
const table = (...cells: unknown[]) => block('table', [block('table-row', cells)]) as Node
const list = (...items: string[]) =>
  block(
    'unordered-list',
    items.map((item) => block('list-item', [paragraph(item)])),
  ) as Node

describe('plainText', () => {
  it('joins the text of nested nodes', () => {
    expect(plainText(richDocument(paragraph('Rust,'), paragraph('empathie')))).toBe(
      'Rust, empathie',
    )
  })

  it('returns an empty string without a node', () => {
    expect(plainText(undefined)).toBe('')
  })
})

describe('summarise', () => {
  it('collapses whitespace and strips a byte order mark', () => {
    expect(summarise(richDocument(paragraph('\uFEFFpersoonlijk,  open-minded')))).toBe(
      'persoonlijk, open-minded',
    )
  })

  it('cuts long text at a word boundary', () => {
    expect(summarise(richDocument(paragraph('een twee drie vier')), 12)).toBe('een twee…')
  })
})

describe('imagesInLayoutTable', () => {
  it('returns the images of a table that holds only images', () => {
    const images = imagesInLayoutTable(table(cell(imageLink('LVVP')), cell(imageLink('NIP'))))
    expect(images?.map((image) => image.data.target.fields.title)).toEqual(['LVVP', 'NIP'])
  })

  it('returns null for a data table', () => {
    expect(imagesInLayoutTable(table(cell(text('Intake')), cell(text('€ 120'))))).toBeNull()
  })
})

describe('isLongList', () => {
  it('accepts eight or more short items', () => {
    expect(isLongList(list('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'))).toBe(true)
  })

  it('rejects short lists and lists of long items', () => {
    expect(isLongList(list('a', 'b'))).toBe(false)
    expect(isLongList(list(...Array.from({ length: 8 }, () => 'x'.repeat(120))))).toBe(false)
  })
})
