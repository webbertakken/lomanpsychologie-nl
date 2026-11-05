#!/usr/bin/env node
/**
 * Puts who can register next to the ways to get in touch:
 *   - the `registrationStop` type ("Aanmeldstop") and its one entry, a switch
 *     with a note, shown on the appointment card and the contact page;
 *   - a `referral` field on the contact section, saying the GP stays the point
 *     of contact until treatment starts (the practice's own words from the
 *     Algemene voorwaarden).
 * Additive: existing entries and fields an author changed are left as they are.
 *
 *   node scripts/contentful-registration.mjs [--apply]
 *
 * Needs CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID.
 */
import process from 'node:process'

const apply = process.argv.includes('--apply')
const space = process.env.CONTENTFUL_SPACE_ID
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'
const stopId = 'registration-stop'
const contactId = 'contact-section'

if (!space || !token) {
  console.error('[registration] set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

const base = `https://api.contentful.com/spaces/${space}/environments/${environment}`
const request = async (method, path, { body, version, contentType } = {}) => {
  const response = await fetch(base + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...(version !== undefined && { 'X-Contentful-Version': String(version) }),
      ...(contentType && { 'X-Contentful-Content-Type': contentType }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })
  if (response.status === 404 && method === 'GET') return null
  if (!response.ok)
    throw new Error(
      `[registration] ${method} ${path} answered ${response.status}: ${await response.text()}`,
    )
  return response.json()
}

const say = (message) => console.info(`[registration] ${apply ? '' : 'would '}${message}`)

const save = async (path, body, version, contentType) => {
  const saved = await request('PUT', path, { body, version, contentType })
  await request('PUT', `${path}/published`, { version: saved.sys.version })
}

const hasDraft = ({ sys }) => sys.version > sys.publishedVersion + 1

const stopType = {
  name: 'Aanmeldstop',
  description:
    'Switch on while the practice takes no new referrals. Shown on the appointment card and the contact page.',
  displayField: 'message',
  fields: [
    {
      id: 'message',
      name: 'Toelichting',
      type: 'Text',
      localized: true,
      required: true,
    },
    { id: 'isEnabled', name: 'Aanmeldstop aan', type: 'Boolean', localized: false, required: true },
  ],
}

const stopEntry = {
  message: {
    'nl-NL':
      'Op dit moment kan er niet naar onze praktijk worden verwezen. Naar verwachting zal per januari-februari 2027 weer verwezen kunnen worden.',
    'en-GB':
      'At the moment, no referrals to our practice can be made. Referrals are expected to be possible again from January-February 2027.',
  },
  isEnabled: { 'nl-NL': true },
}

const referralField = {
  id: 'referral',
  name: 'Referral and the GP',
  type: 'Text',
  localized: true,
  required: false,
}

const referral = {
  'nl-NL':
    'Tot uw behandeling is gestart, blijft uw huisarts uw aanspreekpunt. Nemen uw klachten toe of heeft u dringend hulp nodig, neem dan contact op met uw huisarts.',
  'en-GB':
    'Until your treatment has started, your GP remains your point of contact. If your symptoms get worse or you need help urgently, please contact your GP.',
}

const ensureStop = async () => {
  if (await request('GET', '/content_types/registrationStop')) {
    say('keep the registrationStop type as it is')
  } else {
    say('create and publish the registrationStop type')
    if (apply) await save('/content_types/registrationStop', stopType)
  }
  if (await request('GET', `/entries/${stopId}`)) {
    say('keep the registration stop entry as the practice set it')
    return
  }
  say('create and publish the registration stop entry, switched on')
  if (apply) await save(`/entries/${stopId}`, { fields: stopEntry }, undefined, 'registrationStop')
}

const ensureReferralField = async () => {
  const type = await request('GET', '/content_types/contactSection')
  if (type.fields.some(({ id }) => id === referralField.id)) {
    say('keep the referral field on contactSection')
    return
  }
  const fields = [...type.fields]
  fields.splice(
    fields.findIndex(({ id }) => id === 'email'),
    0,
    referralField,
  )
  say('add the referral field to contactSection, in front of the e-mail address')
  if (!apply) return
  const { name, description, displayField } = type
  await save(
    '/content_types/contactSection',
    { name, description, displayField, fields },
    type.sys.version,
  )
}

const fillReferral = async () => {
  const entry = await request('GET', `/entries/${contactId}`)
  if (entry.fields.referral) {
    say('keep the referral text the practice wrote')
    return
  }
  if (hasDraft(entry)) throw new Error('[registration] the contact section has unpublished changes')
  say('fill in the referral text and publish the contact section')
  if (!apply) return
  await save(
    `/entries/${contactId}`,
    { fields: { ...entry.fields, referral }, metadata: entry.metadata },
    entry.sys.version,
  )
}

const main = async () => {
  await ensureStop()
  await ensureReferralField()
  // A new field needs a moment before entries accept it.
  if (apply) await new Promise((resolve) => setTimeout(resolve, 2000))
  await fillReferral()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
