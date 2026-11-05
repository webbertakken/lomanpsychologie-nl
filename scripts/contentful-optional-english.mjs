#!/usr/bin/env node
/**
 * Lets the practice publish an entry written only in Dutch. Required fields
 * would otherwise need an English value too, and Contentful refuses to
 * publish ("Validation failed"). Empty English fields fall back to Dutch.
 *
 *   node scripts/contentful-optional-english.mjs [--apply]
 *
 * Needs CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID.
 */
import process from 'node:process'

const apply = process.argv.includes('--apply')
const space = process.env.CONTENTFUL_SPACE_ID
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'

if (!space || !token) {
  console.error('[locales] set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

const base = `https://api.contentful.com/spaces/${space}/environments/${environment}`
const request = async (method, path, { body, version } = {}) => {
  const response = await fetch(base + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...(version !== undefined && { 'X-Contentful-Version': String(version) }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })
  if (!response.ok)
    throw new Error(
      `[locales] ${method} ${path} answered ${response.status}: ${await response.text()}`,
    )
  return response.json()
}

const main = async () => {
  const { items } = await request('GET', '/locales')
  const english = items.find(({ code }) => code === 'en-GB')
  if (!english) throw new Error('[locales] there is no en-GB locale')
  if (english.fallbackCode !== 'nl-NL')
    throw new Error(`[locales] en-GB falls back to ${english.fallbackCode}, not nl-NL`)
  if (english.optional) {
    console.info('[locales] en-GB is already optional')
    return
  }
  console.info(`[locales] ${apply ? '' : 'would '}make en-GB optional, falling back to nl-NL`)
  if (!apply) return
  const { name, code, fallbackCode, contentDeliveryApi, contentManagementApi } = english
  const saved = await request('PUT', `/locales/${english.sys.id}`, {
    body: { name, code, fallbackCode, contentDeliveryApi, contentManagementApi, optional: true },
    version: english.sys.version,
  })
  console.info(`[locales] en-GB optional: ${saved.optional}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
