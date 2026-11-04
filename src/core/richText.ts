import type { Block, Document, Inline, Node, Text } from '@contentful/rich-text-types'

const isText = (node: Node): node is Text => node.nodeType === 'text'
const hasContent = (node: Node): node is Block | Inline | Document => 'content' in node

/** The visible text of a rich text node, without markup. */
export const plainText = (node: Node | undefined): string => {
  if (!node) return ''
  if (isText(node)) return node.value
  if (!hasContent(node)) return ''
  const separator = node.nodeType === 'document' ? ' ' : ''
  return node.content.map(plainText).join(separator)
}

/** A short description for `<meta name="description">`, cut at a word boundary. */
export const summarise = (document: Document | undefined, maxLength = 160): string => {
  const text = plainText(document)
    .replace(/\s+/g, ' ')
    .replace(/^\uFEFF/, '')
    .trim()
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

const isImageLink = (node: Node): boolean =>
  (node.nodeType === 'asset-hyperlink' || node.nodeType === 'embedded-asset-block') &&
  Boolean(node.data?.target?.fields?.file?.contentType?.startsWith('image/'))

const collect = (node: Node, predicate: (node: Node) => boolean): Node[] => [
  ...(predicate(node) ? [node] : []),
  ...(hasContent(node) ? node.content.flatMap((child) => collect(child, predicate)) : []),
]

/**
 * Authors lay out rows of logos as a table of image links. Such a table holds
 * no data, so it is shown as a row of images instead of a grid.
 */
const textOutsideImages = (node: Node): string => {
  if (isImageLink(node)) return ''
  if (isText(node)) return node.value
  return hasContent(node) ? node.content.map(textOutsideImages).join('') : ''
}

export const imagesInLayoutTable = (table: Node): Node[] | null => {
  const images = collect(table, isImageLink)
  const text = textOutsideImages(table).trim()
  return images.length > 0 && text === '' ? images : null
}

/** Lists this long read better in columns on wide screens. */
export const isLongList = (list: Node): boolean =>
  hasContent(list) && list.content.length >= 8 && plainText(list).length / list.content.length < 90

const headingTypes = new Set(['heading-1', 'heading-2', 'heading-3'])

const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export interface Heading {
  id: string
  text: string
}

/**
 * The headings of a text, each with a unique anchor id, in reading order. The
 * renderer gives each heading the id at its position, so an index built from
 * this list always links to the right place.
 */
export const headingsOf = (document: Document | undefined): Heading[] => {
  const seen = new Map<string, number>()
  return (document?.content ?? [])
    .filter((node) => headingTypes.has(node.nodeType) && plainText(node).trim() !== '')
    .map((node) => {
      const text = plainText(node).trim()
      const base = slugify(text) || 'kop'
      const count = (seen.get(base) ?? 0) + 1
      seen.set(base, count)
      return { id: count === 1 ? base : `${base}-${count}`, text }
    })
}
