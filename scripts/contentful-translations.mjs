#!/usr/bin/env node
/**
 * Writes reviewed English (en-GB) translations into Contentful.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=... CONTENTFUL_SPACE_ID=... \
 *     node scripts/contentful-translations.mjs <translations.json> [--apply] [--pause-webhooks]
 *
 * <translations.json> holds [{ entry, field, action, en }]. Without --apply it
 * only reports what it would change.
 *
 * Guarantees:
 * - Only the en-GB value of a field is written; Dutch is never touched.
 * - A rich-text translation must have the Dutch document's exact tree: same
 *   nodes, links and marks, only text values differ.
 * - An entry with unpublished changes is skipped, so an author's draft is
 *   never published by this script.
 * - Slugs of sections stay equal to the Dutch ones, so anchors such as
 *   /#wachttijden work in both languages; page slugs are translated.
 * - --pause-webhooks switches the space's webhooks off during the run (each
 *   publish would otherwise redeploy the site) and always switches them back.
 */
import { readFileSync } from 'node:fs'
import process from 'node:process'

const [file] = process.argv.slice(2).filter((argument) => !argument.startsWith('--'))
const apply = process.argv.includes('--apply')
const pauseWebhooks = process.argv.includes('--pause-webhooks')
const space = process.env.CONTENTFUL_SPACE_ID
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'
const [dutch, english] = ['nl-NL', 'en-GB']

if (!file || !space || !token) {
  console.error('[i18n] usage: node scripts/contentful-translations.mjs <file> [--apply]')
  process.exit(1)
}

const base = `https://api.contentful.com/spaces/${space}`
const envBase = `${base}/environments/${environment}`

const request = async (method, url, { body, version } = {}) => {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...(version !== undefined && { 'X-Contentful-Version': String(version) }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })
  if (!response.ok) {
    throw new Error(
      `[i18n] ${method} ${url.replace(base, '')} answered ${response.status}: ${await response.text()}`,
    )
  }
  return response.status === 204 ? null : response.json()
}

// Rich text: everything but text values must match.
const shape = (node) => {
  if (!node || typeof node !== 'object') return node
  if (Array.isArray(node)) return node.map(shape)
  return Object.fromEntries(
    Object.entries(node).map(([key, value]) =>
      key === 'value' && node.nodeType === 'text'
        ? [key, value.trim() === '' ? value : 'T']
        : [key, shape(value)],
    ),
  )
}
const isRichText = (value) => value?.nodeType === 'document'
const sameTree = (a, b) => JSON.stringify(shape(a)) === JSON.stringify(shape(b))

// Fields of these types become translatable before English is written.
const localise = { faqItem: ['question', 'answer'], faqSection: ['title', 'subtitle'] }

const hasUnpublishedChanges = ({ sys }) =>
  sys.publishedVersion !== undefined && sys.version > sys.publishedVersion + 1

const makeFieldsTranslatable = async () => {
  for (const [id, fieldIds] of Object.entries(localise)) {
    const type = await request('GET', `${envBase}/content_types/${id}`)
    const toChange = type.fields.filter((field) => fieldIds.includes(field.id) && !field.localized)
    if (toChange.length === 0) continue
    console.info(
      `[i18n] ${apply ? '' : 'would '}make ${id}.${toChange.map((f) => f.id).join(', ')} translatable`,
    )
    if (!apply) continue
    for (const field of toChange) field.localized = true
    const { name, description, displayField, fields } = type
    const saved = await request('PUT', `${envBase}/content_types/${id}`, {
      body: { name, description, displayField, fields },
      version: type.sys.version,
    })
    await request('PUT', `${envBase}/content_types/${id}/published`, { version: saved.sys.version })
  }
}

const withPausedWebhooks = async (work) => {
  if (!pauseWebhooks || !apply) return work()
  const { items } = await request('GET', `${base}/webhook_definitions`)
  const active = items.filter((hook) => hook.active)
  const setActive = async (hook, isActive) => {
    const current = await request('GET', `${base}/webhook_definitions/${hook.sys.id}`)
    const { name, url, topics, filters, headers, transformation, httpBasicUsername } = current
    await request('PUT', `${base}/webhook_definitions/${hook.sys.id}`, {
      body: {
        name,
        url,
        topics,
        filters,
        headers,
        transformation,
        httpBasicUsername,
        active: isActive,
      },
      version: current.sys.version,
    })
    console.info(`[i18n] webhook "${hook.name}" ${isActive ? 'on again' : 'paused'}`)
  }
  for (const hook of active) await setActive(hook, false)
  try {
    return await work()
  } finally {
    for (const hook of active) await setActive(hook, true)
  }
}

const main = async () => {
  const translations = JSON.parse(readFileSync(file, 'utf8'))
  const byEntry = Map.groupBy(translations, ({ entry }) => entry)
  const report = { written: 0, unchanged: 0, skippedDraft: [], rejected: [] }

  await makeFieldsTranslatable()

  await withPausedWebhooks(async () => {
    for (const [id, items] of byEntry) {
      const entry = await request('GET', `${envBase}/entries/${id}`)
      const contentType = entry.sys.contentType.sys.id
      if (hasUnpublishedChanges(entry)) {
        report.skippedDraft.push(id)
        console.warn(`[i18n] skip ${contentType} ${id}: it has unpublished changes`)
        continue
      }

      let changed = 0
      for (const { field, en } of items) {
        const nl = entry.fields[field]?.[dutch]
        if (nl === undefined) continue
        const value = field === 'slug' && contentType !== 'page' ? nl : en
        if (isRichText(nl) && !sameTree(nl, value)) {
          report.rejected.push(`${id}.${field}`)
          console.error(
            `[i18n] reject ${contentType} ${id}.${field}: its tree differs from the Dutch`,
          )
          continue
        }
        if (JSON.stringify(entry.fields[field][english]) === JSON.stringify(value)) continue
        entry.fields[field] = { ...entry.fields[field], [english]: value }
        changed++
      }

      if (changed === 0) {
        report.unchanged++
        continue
      }
      console.info(
        `[i18n] ${apply ? '' : 'would '}write ${changed} field(s) of ${contentType} ${id}`,
      )
      report.written++
      if (!apply) continue
      const saved = await request('PUT', `${envBase}/entries/${id}`, {
        body: { fields: entry.fields, metadata: entry.metadata },
        version: entry.sys.version,
      })
      if (entry.sys.publishedVersion !== undefined) {
        await request('PUT', `${envBase}/entries/${id}/published`, { version: saved.sys.version })
      }
    }
  })

  console.info(`[i18n] ${JSON.stringify(report)}`)
  if (report.rejected.length > 0) process.exitCode = 2
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
