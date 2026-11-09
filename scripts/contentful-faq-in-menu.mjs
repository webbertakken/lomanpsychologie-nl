#!/usr/bin/env node
/**
 * Puts the FAQ in the header menu as "Vragen", last in the header order, and
 * takes Home out of it: the logo leads home, and the header has room for four
 * menu items next to the language switch, theme toggle, phone number and
 * Contact button.
 *
 * An unpublished draft of the home page stays a draft: the published version
 * is republished with only the switch changed, then the draft is saved back.
 *
 *   node scripts/contentful-faq-in-menu.mjs [--apply]
 *
 * Needs CONTENTFUL_MANAGEMENT_TOKEN, CONTENTFUL_ACCESS_TOKEN and CONTENTFUL_SPACE_ID.
 */
import process from 'node:process'

const apply = process.argv.includes('--apply')
const space = process.env.CONTENTFUL_SPACE_ID
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const deliveryToken = process.env.CONTENTFUL_ACCESS_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'

if (!space || !token || !deliveryToken) {
  console.error(
    '[menu] set CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_ACCESS_TOKEN',
  )
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
      `[menu] ${method} ${path} answered ${response.status}: ${await response.text()}`,
    )
  return response.json()
}

const publishedFields = async (id) => {
  const url = `https://cdn.contentful.com/spaces/${space}/environments/${environment}/entries/${id}?locale=*`
  const response = await fetch(url, { headers: { Authorization: `Bearer ${deliveryToken}` } })
  if (!response.ok) throw new Error(`[menu] delivery API answered ${response.status} for ${id}`)
  return (await response.json()).fields
}

const say = (message) => console.info(`[menu] ${apply ? '' : 'would '}${message}`)
const hasDraft = ({ sys }) => sys.version > sys.publishedVersion + 1
const link = (id) => ({ sys: { type: 'Link', linkType: 'Entry', id } })

const put = (entry, fields, version) =>
  request('PUT', `/entries/${entry.sys.id}`, {
    body: { fields, metadata: entry.metadata },
    version,
  })
const publish = (entry, version) =>
  request('PUT', `/entries/${entry.sys.id}/published`, { version })

/** Saves and publishes an entry without a draft. */
const save = async (entry) => {
  if (!apply) return
  if (hasDraft(entry)) throw new Error(`[menu] ${entry.sys.id} has unpublished changes`)
  const saved = await put(entry, entry.fields, entry.sys.version)
  await publish(entry, saved.sys.version)
}

const onlyEntry = async (query) => {
  const { items } = await request('GET', `/entries?${query}&limit=1`)
  if (!items[0]) throw new Error(`[menu] nothing matches ${query}`)
  return items[0]
}

const hideHomeFromHeader = async () => {
  const home = await onlyEntry('content_type=page&fields.slug=home')
  const off = { 'nl-NL': false }
  if (home.fields.shouldBeShownInHeader?.['nl-NL'] === false)
    return say('keep Home out of the header')
  if (!hasDraft(home)) {
    say('take Home out of the header')
    home.fields.shouldBeShownInHeader = off
    return save(home)
  }
  say('take Home out of the header, keeping its unpublished draft as a draft')
  if (!apply) return
  const live = await publishedFields(home.sys.id)
  const saved = await put(home, { ...live, shouldBeShownInHeader: off }, home.sys.version)
  const published = await publish(home, saved.sys.version)
  await put(home, { ...home.fields, shouldBeShownInHeader: off }, published.sys.version)
}

const showFaqInHeader = async () => {
  const faq = await onlyEntry('content_type=page&fields.slug=veelgestelde-vragen')
  const header = await onlyEntry('content_type=menuSortOrder&fields.menu=header')
  const order = header.fields.pages['nl-NL'].map(({ sys }) => sys.id)
  if (order.includes(faq.sys.id)) say('keep the header order as it is')
  else {
    say(`add the FAQ last in the header order`)
    header.fields.pages['nl-NL'] = [...order, faq.sys.id].map(link)
    await save(header)
  }
  const shown =
    faq.fields.shouldBeShownInHeader?.['nl-NL'] && faq.fields.menuItemTitle?.['nl-NL'] === 'Vragen'
  if (shown) return say('keep the FAQ in the header as "Vragen"')
  say('show the FAQ in the header as "Vragen" (English keeps "FAQ")')
  faq.fields.shouldBeShownInHeader = { 'nl-NL': true }
  faq.fields.menuItemTitle = { ...faq.fields.menuItemTitle, 'nl-NL': 'Vragen' }
  await save(faq)
}

// Home leaves first, so the live header never shows five items.
hideHomeFromHeader()
  .then(showFaqInHeader)
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
