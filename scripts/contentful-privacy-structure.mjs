#!/usr/bin/env node
/**
 * Gives the privacy policy real structure in Contentful, in every locale:
 * bold-only paragraphs become headings, runs of paragraphs starting with a
 * dash become bulleted lists, and empty paragraphs go. The words stay exactly
 * the same; the script refuses to write if any text would change.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=... CONTENTFUL_SPACE_ID=... \
 *     node scripts/contentful-privacy-structure.mjs [--apply]
 */
import process from 'node:process'

const entryId = '4yNHzMNWr6QZbLowxiTDPA'
const apply = process.argv.includes('--apply')
const space = process.env.CONTENTFUL_SPACE_ID
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'

if (!space || !token) {
  console.error('[privacy] set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

const url = `https://api.contentful.com/spaces/${space}/environments/${environment}/entries/${entryId}`
const request = async (method, path = '', { body, version } = {}) => {
  const response = await fetch(url + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...(version !== undefined && { 'X-Contentful-Version': String(version) }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })
  if (!response.ok)
    throw new Error(`[privacy] ${method} answered ${response.status}: ${await response.text()}`)
  return response.json()
}

const dash = /^[\s\u00a0]*[–-][\s\u00a0]+/
const textOf = (node) =>
  node.nodeType === 'text' ? node.value : (node.content ?? []).map(textOf).join('')
const isParagraph = (node) => node.nodeType === 'paragraph'
const onlyText = (node) => node.content.every((child) => child.nodeType === 'text')
const isEmpty = (node) => isParagraph(node) && onlyText(node) && textOf(node).trim() === ''
const isBullet = (node) => isParagraph(node) && dash.test(textOf(node))
const isHeading = (node) =>
  isParagraph(node) &&
  onlyText(node) &&
  !isBullet(node) &&
  textOf(node).trim().length > 0 &&
  textOf(node).trim().length < 80 &&
  node.content
    .filter((child) => child.value.trim() !== '')
    .every((child) => child.marks.some(({ type }) => type === 'bold'))

const withoutDash = (paragraph) => {
  const [first, ...rest] = paragraph.content
  return { ...paragraph, content: [{ ...first, value: first.value.replace(dash, '') }, ...rest] }
}

const headingFrom = (paragraph) => ({
  nodeType: 'heading-3',
  data: {},
  content: paragraph.content.map((text) => ({ ...text, value: text.value.trim(), marks: [] })),
})

/** The new document, decided from the Dutch and applied to each locale by position. */
const restructure = (template, document) => {
  const blocks = []
  let list = null
  template.content.forEach((node, index) => {
    const own = document.content[index]
    if (isBullet(node)) {
      list ??= { nodeType: 'unordered-list', data: {}, content: [] }
      list.content.push({ nodeType: 'list-item', data: {}, content: [withoutDash(own)] })
      return
    }
    if (list) blocks.push(list)
    list = null
    if (isEmpty(node)) return
    blocks.push(isHeading(node) ? headingFrom(own) : own)
  })
  if (list) blocks.push(list)
  return { ...document, content: blocks }
}

// Every word in order, with blocks kept apart; dashes and spacing are ignored.
const blockText = (node) =>
  node.nodeType === 'text' ? node.value : (node.content ?? []).map(blockText).join(' ')
const words = (document) =>
  blockText(document)
    .replace(/[–\s\u00a0]+/g, ' ')
    .trim()

const main = async () => {
  const entry = await request('GET')
  if (entry.sys.version > entry.sys.publishedVersion + 1)
    throw new Error('[privacy] has unpublished changes')
  const content = entry.fields.content
  const template = content['nl-NL']
  if (template.content.some((node) => node.nodeType === 'heading-3')) {
    console.info('[privacy] already has headings, nothing to do')
    return
  }

  for (const [locale, document] of Object.entries(content)) {
    if (document.content.length !== template.content.length) {
      throw new Error(`[privacy] ${locale} does not have the Dutch structure`)
    }
    const result = restructure(template, document)
    if (words(result) !== words(document)) {
      const [a, b] = [words(document), words(result)]
      const at = [...a].findIndex((char, i) => char !== b[i])
      throw new Error(
        `[privacy] ${locale} text would change near: ${a.slice(at - 40, at + 40)} | ${b.slice(at - 40, at + 40)}`,
      )
    }
    const count = (type) => result.content.filter(({ nodeType }) => nodeType === type).length
    console.info(
      `[privacy] ${locale}: ${document.content.length} blocks -> ${result.content.length}; ${count('heading-3')} headings, ${count('unordered-list')} lists; text identical`,
    )
    content[locale] = result
  }

  if (!apply) return
  const saved = await request('PUT', '', {
    body: { fields: entry.fields, metadata: entry.metadata },
    version: entry.sys.version,
  })
  await request('PUT', '/published', { version: saved.sys.version })
  console.info('[privacy] published')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
